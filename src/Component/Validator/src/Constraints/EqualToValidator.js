const AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;
const EqualTo = Jymfony.Component.Validator.Constraints.EqualTo;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class EqualToValidator extends AbstractComparisonValidator {
    /**
     * @inheritdoc
     */
    _compareValues(value1, value2) {
        return __jymfony.equal(value1, value2, false);
    }

    /**
     * @inheritdoc
     */
    _getErrorCode() {
        return EqualTo.NOT_EQUAL_ERROR;
    }
}
