const AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;
const GreaterThanOrEqual = Jymfony.Component.Validator.Constraints.GreaterThanOrEqual;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class GreaterThanOrEqualValidator extends AbstractComparisonValidator {
    /**
     * @inheritdoc
     */
    _compareValues(value1, value2) {
        if (null === value2 || undefined === value2) {
            return true;
        }

        return value1 >= value2;
    }

    /**
     * @inheritdoc
     */
    _getErrorCode() {
        return GreaterThanOrEqual.TOO_LOW_ERROR;
    }
}
