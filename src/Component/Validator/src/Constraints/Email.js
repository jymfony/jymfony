const Constraint = Jymfony.Component.Validator.Constraint;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Email extends Constraint {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        switch (errorCode) {
            case __self.INVALID_FORMAT_ERROR: return 'INVALID_FORMAT_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value is not a valid email address.';
        this.mode = undefined;
        this.normalizer = undefined;

        if (isObjectLiteral(options) && undefined !== options.mode && ! __self.validationModes.includes(options.mode)) {
            throw new InvalidArgumentException('The "mode" parameter value is not valid.');
        }

        const ret = super.__construct(options);

        if (__self.VALIDATION_MODE_STRICT === this.mode && ! ReflectionClass.exists('StrictEmailValidator')) {
            throw new LogicException(__jymfony.sprintf('The "%s" constraint strict mode validation is still unimplemented.', ReflectionClass.getClassName(this)));
        }

        if (undefined !== this.normalizer && ! isFunction(this.normalizer)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "normalizer" option must be a valid callable ("%s" given).', __jymfony.get_debug_type(this.normalizer)));
        }

        return ret;
    }
}

Object.defineProperties(Email, {
    INVALID_FORMAT_ERROR: { value: 'bd79c0ab-ddba-46cc-a703-a7a4b08de310', writable: false },

    VALIDATION_MODE_HTML5: { value: 'html5', writable: false },
    VALIDATION_MODE_STRICT: { value: 'strict', writable: false },
    VALIDATION_MODE_LOOSE: { value: 'loose', writable: false },
});

Object.defineProperty(Email, 'validationModes', { value: [
    Email.VALIDATION_MODE_HTML5,
    Email.VALIDATION_MODE_STRICT,
    Email.VALIDATION_MODE_LOOSE,
], writable: false });
