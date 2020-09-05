const AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;
const NotEqualTo = Jymfony.Component.Validator.Constraints.NotEqualTo;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class NotEqualToValidator extends AbstractComparisonValidator {
    /**
     * @inheritdoc
     */
    _compareValues(value1, value2) {
        return ! __jymfony.equal(value1, value2, false);
    }

    /**
     * @inheritdoc
     */
    _getErrorCode() {
        return NotEqualTo.IS_EQUAL_ERROR;
    }
}
