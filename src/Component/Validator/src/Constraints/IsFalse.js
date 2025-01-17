const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IsFalse extends Constraint {
    message = 'This value should be false.';

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (__self.NOT_FALSE_ERROR === errorCode) {
            return 'NOT_FALSE_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }
}

Object.defineProperty(IsFalse, 'NOT_FALSE_ERROR', { value: 'd53a91b0-def3-426a-83d7-269da7ab4200', writable: false });
