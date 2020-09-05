const AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;
const LessThan = Jymfony.Component.Validator.Constraints.LessThan;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class LessThanValidator extends AbstractComparisonValidator {
    /**
     * @inheritdoc
     */
    _compareValues(value1, value2) {
        if (null === value2 || undefined === value2) {
            return true;
        }

        return value1 < value2;
    }

    /**
     * @inheritdoc
     */
    _getErrorCode() {
        return LessThan.TOO_HIGH_ERROR;
    }
}
