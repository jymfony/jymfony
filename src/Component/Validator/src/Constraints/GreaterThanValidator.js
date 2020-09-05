const AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;
const GreaterThan = Jymfony.Component.Validator.Constraints.GreaterThan;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class GreaterThanValidator extends AbstractComparisonValidator {
    /**
     * @inheritdoc
     */
    _compareValues(value1, value2) {
        if (null === value2 || undefined === value2) {
            return true;
        }

        return value1 > value2;
    }

    /**
     * @inheritdoc
     */
    _getErrorCode() {
        return GreaterThan.TOO_LOW_ERROR;
    }
}
