const AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;
const NotIdenticalTo = Jymfony.Component.Validator.Constraints.NotIdenticalTo;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class NotIdenticalToValidator extends AbstractComparisonValidator {
    /**
     * @inheritdoc
     */
    _compareValues(value1, value2) {
        return ! __jymfony.equal(value1, value2, true);
    }

    /**
     * @inheritdoc
     */
    _getErrorCode() {
        return NotIdenticalTo.IS_IDENTICAL_ERROR;
    }
}
