const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IsTrue extends Constraint {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (__self.NOT_TRUE_ERROR === errorCode) {
            return 'NOT_TRUE_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should be true.';

        return super.__construct(options);
    }
}

Object.defineProperty(IsTrue, 'NOT_TRUE_ERROR', { value: '2beabf1c-54c0-4882-a928-05249b26e23b', writable: false });
