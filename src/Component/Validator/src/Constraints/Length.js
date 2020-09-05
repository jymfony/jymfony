const Constraint = Jymfony.Component.Validator.Constraint;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;
const MissingOptionsException = Jymfony.Component.Validator.Exception.MissingOptionsException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Length extends Constraint {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.TOO_SHORT_ERROR: return 'TOO_SHORT_ERROR';
            case __self.TOO_LONG_ERROR: return 'TOO_LONG_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        if (null !== options && ! isObjectLiteral(options)) {
            options = {
                min: options,
                max: options,
            };
        } else if (isObjectLiteral(options) && undefined !== options.value && undefined === options.min && undefined === options.max) {
            options.min = options.max = options.value;
            delete options.value;
        }

        this.maxMessage = 'This value is too long. It should have {{ limit }} character or less.|This value is too long. It should have {{ limit }} characters or less.';
        this.minMessage = 'This value is too short. It should have {{ limit }} character or more.|This value is too short. It should have {{ limit }} characters or more.';
        this.exactMessage = 'This value should have exactly {{ limit }} character.|This value should have exactly {{ limit }} characters.';
        this.max = undefined;
        this.min = undefined;
        this.normalizer = undefined;

        const ret = super.__construct(options);

        if (undefined === this.min && undefined === this.max) {
            throw new MissingOptionsException(__jymfony.sprintf('Either option "min" or "max" must be given for constraint "%s".', __jymfony.get_debug_type(this)), [ 'min', 'max' ]);
        }

        if (undefined !== this.normalizer && ! isFunction(this.normalizer)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "normalizer" option must be a valid callable ("%s" given).', __jymfony.get_debug_type(this.normalizer)));
        }

        return ret;
    }
}

Object.defineProperties(Length, {
    TOO_SHORT_ERROR: { value: '9ff3fdc4-b214-49db-8718-39c315e33d45', writable: false },
    TOO_LONG_ERROR: { value: 'd94b19cc-114f-4f44-9cc4-4138e80a87b9', writable: false },
});
