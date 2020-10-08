const AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;
const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class EqualTo extends AbstractComparison {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (EqualTo.NOT_EQUAL_ERROR === errorCode) {
            return 'NOT_EQUAL_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should be equal to {{ compared_value }}.';

        return super.__construct(options);
    }
}

Object.defineProperty(EqualTo, 'NOT_EQUAL_ERROR', { value: '478618a7-95ba-473d-9101-cabd45e49115', writable: false });
