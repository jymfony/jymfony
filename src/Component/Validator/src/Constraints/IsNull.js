const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IsNull extends Constraint {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (IsNull.NOT_NULL_ERROR === errorCode) {
            return 'NOT_NULL_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should be null.';

        return super.__construct(options);
    }
}

Object.defineProperty(IsNull, 'NOT_NULL_ERROR', { value: '60d2f30b-8cfa-4372-b155-9656634de120', writable: false });
