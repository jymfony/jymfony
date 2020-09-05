const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Issn = Jymfony.Component.Validator.Constraints.Issn;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IssnValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Issn)) {
            throw new UnexpectedTypeException(constraint, Issn);
        }

        if (undefined === value || null === value || '' === value) {
            return;
        }

        value = String(value);
        let canonical = value;

        // 1234-567X
        //     ^
        if (undefined !== canonical[4] && '-' === canonical[4]) {
            // Remove hyphen
            canonical = canonical.substr(0, 4) + canonical.substr(5);
        } else if (constraint.requireHyphen) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Issn.MISSING_HYPHEN_ERROR)
                .addViolation();

            return;
        }

        if (8 > canonical.length) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Issn.TOO_SHORT_ERROR)
                .addViolation();

            return;
        }

        if (8 < canonical.length) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Issn.TOO_LONG_ERROR)
                .addViolation();

            return;
        }

        // 1234567X
        // ^^^^^^^ digits only
        if (! canonical.substr(0, 7).match(/^[0-9]+$/)) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Issn.INVALID_CHARACTERS_ERROR)
                .addViolation();

            return;
        }

        // 1234567X
        //        ^ digit, x or X
        if (!isNumeric(canonical[7]) && 'x' !== canonical[7] && 'X' !== canonical[7]) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Issn.INVALID_CHARACTERS_ERROR)
                .addViolation();

            return;
        }

        // 1234567X
        //        ^ case-sensitive?
        if (constraint.caseSensitive && 'x' === canonical[7]) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Issn.INVALID_CASE_ERROR)
                .addViolation();

            return;
        }

        // Calculate a checksum. "X" equals 10.
        let checkSum = 'X' === canonical[7] || 'x' === canonical[7] ? 10 : ~~canonical[7];

        for (let i = 0; 7 > i; ++i) {
            // Multiply the first digit by 8, the second by 7, etc.
            checkSum += (8 - i) * ~~canonical[i];
        }

        if (0 !== checkSum % 11) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Issn.CHECKSUM_FAILED_ERROR)
                .addViolation();
        }
    }
}
