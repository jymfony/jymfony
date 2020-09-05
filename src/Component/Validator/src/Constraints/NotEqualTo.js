const AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;
const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class NotEqualTo extends AbstractComparison {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (NotEqualTo.IS_EQUAL_ERROR === errorCode) {
            return 'IS_EQUAL_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should not be equal to {{ compared_value }}.';

        return super.__construct(options);
    }
}

Object.defineProperty(NotEqualTo, 'IS_EQUAL_ERROR', { value: 'aa2e33da-25c8-4d76-8c6c-812f02ea89dd', writable: false });
