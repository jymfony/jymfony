const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IsTrue extends Constraint {
    message = 'This value should be true.';

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (__self.NOT_TRUE_ERROR === errorCode) {
            return 'NOT_TRUE_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }
}

Object.defineProperty(IsTrue, 'NOT_TRUE_ERROR', { value: '2beabf1c-54c0-4882-a928-05249b26e23b', writable: false });
