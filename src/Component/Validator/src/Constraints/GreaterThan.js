const AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;
const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class GreaterThan extends AbstractComparison {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (GreaterThan.TOO_LOW_ERROR === errorCode) {
            return 'TOO_LOW_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should be greater than {{ compared_value }}.';

        return super.__construct(options);
    }
}

Object.defineProperty(GreaterThan, 'TOO_LOW_ERROR', { value: '778b7ae0-84d3-481a-9dec-35fdb64b1d78', writable: false });
