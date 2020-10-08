const AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;
const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class LessThanOrEqual extends AbstractComparison {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (LessThanOrEqual.TOO_HIGH_ERROR === errorCode) {
            return 'TOO_HIGH_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should be less than or equal to {{ compared_value }}.';

        return super.__construct(options);
    }
}

Object.defineProperty(LessThanOrEqual, 'TOO_HIGH_ERROR', { value: '30fbb013-d015-4232-8b3b-8f3be97a7e14', writable: false });
