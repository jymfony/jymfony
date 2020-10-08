const AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;
const LessThanOrEqual = Jymfony.Component.Validator.Constraints.LessThanOrEqual;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class LessThanOrEqualValidator extends AbstractComparisonValidator {
    /**
     * @inheritdoc
     */
    _compareValues(value1, value2) {
        if (null === value2 || undefined === value2) {
            return true;
        }

        return value1 <= value2;
    }

    /**
     * @inheritdoc
     */
    _getErrorCode() {
        return LessThanOrEqual.TOO_HIGH_ERROR;
    }
}
