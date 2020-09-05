const AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;
const DivisibleBy = Jymfony.Component.Validator.Constraints.DivisibleBy;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;

/**
 * Validates that values are a multiple of the given number.
 *
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class DivisibleByValidator extends AbstractComparisonValidator {
    /**
     * @inheritdoc
     */
    _compareValues(value1, value2) {
        if (! isNumeric(value1)) {
            throw new UnexpectedValueException(value1, 'numeric');
        }

        if (! isNumeric(value2)) {
            throw new UnexpectedValueException(value2, 'numeric');
        }

        if (! (value2 = Math.abs(value2))) {
            return false;
        }

        const remainder = (value1 % value2);
        if (Number.isInteger(value1 = Math.abs(value1)) && Number.isInteger(value2)) {
            return 0 === remainder;
        }

        return ! remainder || __jymfony.sprintf('%.12e', value2) === __jymfony.sprintf('%.12e', Math.abs(remainder));
    }

    /**
     * @inheritdoc
     */
    _getErrorCode() {
        return DivisibleBy.NOT_DIVISIBLE_BY;
    }
}
