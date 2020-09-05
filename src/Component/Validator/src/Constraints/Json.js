const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Json extends Constraint {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (__self.INVALID_JSON_ERROR === errorCode) {
            return 'INVALID_JSON_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value should be valid JSON.';

        return super.__construct(options);
    }
}

Object.defineProperty(Json, 'INVALID_JSON_ERROR', { value: '0789c8ad-2d2b-49a4-8356-e2ce63998504', writable: false });
