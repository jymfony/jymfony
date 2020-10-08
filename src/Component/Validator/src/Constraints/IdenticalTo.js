const AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;
const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IdenticalTo extends AbstractComparison {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (IdenticalTo.NOT_IDENTICAL_ERROR === errorCode) {
            return 'NOT_IDENTICAL_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should be identical to {{ compared_value_type }} {{ compared_value }}.';

        return super.__construct(options);
    }
}

Object.defineProperty(IdenticalTo, 'NOT_IDENTICAL_ERROR', { value: '2a8cc50f-58a2-4536-875e-060a2ce69ed5', writable: false });
