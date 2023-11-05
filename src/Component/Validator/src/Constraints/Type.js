const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Type extends Constraint {
    message = 'This value should be of type {{ type }}.';
    type = undefined;

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (__self.INVALID_TYPE_ERROR === errorCode) {
            return 'INVALID_TYPE_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    get defaultOption() {
        return 'type';
    }

    /**
     * @inheritdoc
     */
    get requiredOptions() {
        return [ 'type' ];
    }
}

Object.defineProperty(Type, 'INVALID_TYPE_ERROR', { value: 'ba785a8c-82cb-4283-967c-3cf342181b40', writable: false });
