const AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;
const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class GreaterThanOrEqual extends AbstractComparison {
    message = 'This value should be greater than or equal to {{ compared_value }}.';

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (GreaterThanOrEqual.TOO_LOW_ERROR === errorCode) {
            return 'TOO_LOW_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }
}

Object.defineProperty(GreaterThanOrEqual, 'TOO_LOW_ERROR', { value: 'ea4e51d1-3342-48bd-87f1-9e672cd90cad', writable: false });
