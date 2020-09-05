const AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;
const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class LessThan extends AbstractComparison {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (LessThan.TOO_HIGH_ERROR === errorCode) {
            return 'TOO_HIGH_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should be less than {{ compared_value }}.';

        return super.__construct(options);
    }
}

Object.defineProperty(LessThan, 'TOO_HIGH_ERROR', { value: '079d7420-2d13-460c-8756-de810eeb37d2', writable: false });
