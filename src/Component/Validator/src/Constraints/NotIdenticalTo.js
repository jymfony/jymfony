const AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;
const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class NotIdenticalTo extends AbstractComparison {
    message = 'This value should not be identical to {{ compared_value }}.';

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (NotIdenticalTo.IS_IDENTICAL_ERROR === errorCode) {
            return 'IS_IDENTICAL_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }
}

Object.defineProperty(NotIdenticalTo, 'IS_IDENTICAL_ERROR', { value: '4aaac518-0dda-4129-a6d9-e216b9b454a0', writable: false });
