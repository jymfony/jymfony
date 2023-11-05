const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class NotBlank extends Constraint {
    message = 'This value should not be blank.';
    allowNull = false;
    normalizer;

    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (NotNull.IS_BLANK_ERROR === errorCode) {
            return 'IS_BLANK_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        const ret = super.__construct(options);

        if (!! this.normalizer && ! isFunction(this.normalizer)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "normalizer" option must be a valid callable ("%s" given).', __jymfony.get_debug_type(this.normalizer)));
        }

        return ret;
    }
}

Object.defineProperty(NotBlank, 'IS_BLANK_ERROR', { value: 'c1051bb4-d103-4f74-8988-acbcafc7fdc3', writable: false });
