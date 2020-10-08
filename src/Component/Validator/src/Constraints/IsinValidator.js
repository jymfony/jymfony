const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Isin = Jymfony.Component.Validator.Constraints.Isin;
const Luhn = Jymfony.Component.Validator.Constraints.Luhn;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IsinValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    async validate(value, constraint) {
        if (! (constraint instanceof Isin)) {
            throw new UnexpectedTypeException(constraint, Isin);
        }

        if (null === value || '' === value || undefined === value) {
            return;
        }

        value = String(value).toUpperCase();

        if (Isin.VALIDATION_LENGTH !== value.length) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Isin.INVALID_LENGTH_ERROR)
                .addViolation();

            return;
        }

        if (! value.match(Isin.VALIDATION_PATTERN)) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Isin.INVALID_PATTERN_ERROR)
                .addViolation();

            return;
        }

        if (! await this._isCorrectChecksum(value)) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Isin.INVALID_CHECKSUM_ERROR)
                .addViolation();
        }
    }

    /**
     * Checks value for checksum correctness.
     *
     * @param {string} input
     *
     * @returns {boolean}
     *
     * @private
     */
    async _isCorrectChecksum(input) {
        const characters = input.split('');
        for (const [ i, char ] of __jymfony.getEntries(characters)) {
            characters[i] = parseInt(char, 36).toString();
        }

        const number = characters.join('');
        const violations = await this._context.validator.validate(number, new Luhn());

        return 0 === violations.length;
    }
}
