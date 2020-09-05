const AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;
const IdenticalTo = Jymfony.Component.Validator.Constraints.IdenticalTo;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IdenticalToValidator extends AbstractComparisonValidator {
    /**
     * @inheritdoc
     */
    _compareValues(value1, value2) {
        return __jymfony.equal(value1, value2, true);
    }

    /**
     * @inheritdoc
     */
    _getErrorCode() {
        return IdenticalTo.NOT_IDENTICAL_ERROR;
    }
}
