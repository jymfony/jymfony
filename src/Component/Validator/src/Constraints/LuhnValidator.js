const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Luhn = Jymfony.Component.Validator.Constraints.Luhn;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class LuhnValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Luhn)) {
            throw new UnexpectedTypeException(constraint, Luhn);
        }

        if (null === value || '' === value || undefined === value) {
            return;
        }

        if (isNumber(value)) {
            throw new UnexpectedValueException(value, 'string');
        }

        value = String(value);

        if (! value.match(/^[0-9]+$/)) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Luhn.INVALID_CHARACTERS_ERROR)
                .addViolation();

            return;
        }

        let checkSum = 0;
        const length = value.length;

        // Starting with the last digit and walking left, add every second
        // Digit to the check sum
        // E.g. 7  9  9  2  7  3  9  8  7  1  3
        //      ^     ^     ^     ^     ^     ^
        //    = 7  +  9  +  7  +  9  +  7  +  3
        for (let i = length - 1; 0 <= i; i -= 2) {
            checkSum += ~~value[i];
        }

        // Starting with the second last digit and walking left, double every
        // Second digit and add it to the check sum
        // For doubles greater than 9, sum the individual digits
        // E.g. 7  9  9  2  7  3  9  8  7  1  3
        //         ^     ^     ^     ^     ^
        //    =    1+8 + 4  +  6  +  1+6 + 2
        for (let i = length - 2; 0 <= i; i -= 2) {
            checkSum += String(value[i] * 2).split('').reduce((previousValue, currentValue) => previousValue + ~~currentValue, 0);
        }

        if (0 === checkSum || 0 !== checkSum % 10) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Luhn.CHECKSUM_FAILED_ERROR)
                .addViolation();
        }
    }
}
