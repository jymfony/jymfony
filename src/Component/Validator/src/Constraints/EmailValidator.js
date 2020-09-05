const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Email = Jymfony.Component.Validator.Constraints.Email;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;

const HTML5_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const LOOSE_REGEX = /^.+@\S+\.\S+$/;

const patterns = {
    [Email.VALIDATION_MODE_HTML5]: HTML5_REGEX,
    [Email.VALIDATION_MODE_LOOSE]: LOOSE_REGEX,
};

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class EmailValidator extends ConstraintValidator {
    /**
     * Constructor.
     *
     * @param {string} defaultMode
     */
    __construct(defaultMode = Email.VALIDATION_MODE_LOOSE) {
        if (! Email.validationModes.includes(defaultMode)) {
            throw new InvalidArgumentException('The "defaultMode" parameter value is not valid.');
        }

        super.__construct();

        /**
         * @type {string}
         *
         * @private
         */
        this._defaultMode = defaultMode;
    }

    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Email)) {
            throw new UnexpectedTypeException(constraint, Email);
        }

        if (null === value || undefined === value || '' === value) {
            return;
        }

        if (! isScalar(value)) {
            throw new UnexpectedValueException(value, 'string');
        }

        value = String(value);
        if ('' === value) {
            return;
        }

        if (isFunction(constraint.normalizer)) {
            value = (constraint.normalizer)(value);
        }

        if (! constraint.mode) {
            constraint.mode = this._defaultMode;
        }

        if (! Email.validationModes.includes(constraint.mode)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "%s.mode" parameter value is not valid.', __jymfony.get_debug_type(constraint)));
        }

        if (Email.VALIDATION_MODE_STRICT === constraint.mode) {
            throw new Exception('Not implemented yet');
        } else if (! value.match(patterns[constraint.mode])) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Email.INVALID_FORMAT_ERROR)
                .addViolation();
        }
    }
}

