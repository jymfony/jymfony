const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class NotNull extends Constraint {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (NotNull.IS_NULL_ERROR === errorCode) {
            return 'IS_NULL_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should not be null.';

        return super.__construct(options);
    }
}

Object.defineProperty(NotNull, 'IS_NULL_ERROR', { value: 'ad32d13f-c3d4-423b-909a-857b961eb720', writable: false });
