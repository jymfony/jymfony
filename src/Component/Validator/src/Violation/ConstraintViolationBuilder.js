const ConstraintViolation = Jymfony.Component.Validator.ConstraintViolation;
const ConstraintViolationBuilderInterface = Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface;
const PropertyPath = Jymfony.Component.Validator.Util.PropertyPath;

/**
 * Default implementation of {@link ConstraintViolationBuilderInterface}.
 *
 * @memberOf Jymfony.Component.Validator.Violation
 */
export default class ConstraintViolationBuilder extends implementationOf(ConstraintViolationBuilderInterface) {
    /**
     * @type {Jymfony.Component.Validator.ConstraintViolationListInterface}
     *
     * @private
     */
    _violations;

    /**
     * @type {string}
     *
     * @private
     */
    _message;

    /**
     * @type {Object<string, *>}
     *
     * @private
     */
    _parameters;

    /**
     * @type {*}
     *
     * @private
     */
    _root;

    /**
     * @type {string}
     *
     * @private
     */
    _propertyPath;

    /**
     * @type {*}
     *
     * @private
     */
    _invalidValue;

    /**
     * @type {Jymfony.Contracts.Translation.TranslatorInterface}
     *
     * @private
     */
    _translator;

    /**
     * @type {string}
     *
     * @private
     */
    _translationDomain;

    /**
     * @type {Jymfony.Component.Validator.Constraint}
     *
     * @private
     */
    _constraint;

    /**
     * @type {string}
     *
     * @private
     */
    _code;

    /**
     * @type {*}
     *
     * @private
     */
    _cause;

    /**
     * @type {number}
     *
     * @private
     */
    _plural;

    /**
     * @param {Jymfony.Component.Validator.ConstraintViolationListInterface} violations
     * @param {Jymfony.Component.Validator.Constraint} constraint The failed constraint
     * @param {string} message The error message as a string or a stringable object
     * @param {Object.<string, *>} parameters The parameters to substitute in the raw violation message
     * @param {*} root The value originally passed to the validator
     * @param {string} propertyPath The property path from the root value to the invalid value
     * @param {*} invalidValue The invalid value that caused this violation
     * @param {Jymfony.Contracts.Translation.TranslatorInterface} translator
     * @param {string|null} translationDomain
     */
    __construct(violations, constraint, message, parameters, root, propertyPath, invalidValue, translator, translationDomain = null) {
        this._violations = violations;
        this._message = message;
        this._parameters = parameters;
        this._root = root;
        this._propertyPath = propertyPath;
        this._invalidValue = invalidValue;
        this._translator = translator;
        this._translationDomain = translationDomain;
        this._constraint = constraint;
        this._code = undefined;
        this._cause = undefined;
        this._plural = undefined;
    }

    /**
     * @inheritdoc
     */
    atPath(path) {
        this._propertyPath = PropertyPath.append(this._propertyPath, path);

        return this;
    }

    /**
     * @inheritdoc
     */
    setParameter(key, value) {
        this._parameters[key] = value;

        return this;
    }

    /**
     * @inheritdoc
     */
    setParameters(parameters) {
        this._parameters = { ...parameters };

        return this;
    }

    /**
     * @inheritdoc
     */
    setTranslationDomain(translationDomain) {
        this._translationDomain = translationDomain;

        return this;
    }

    /**
     * @inheritdoc
     */
    setInvalidValue(invalidValue) {
        this._invalidValue = invalidValue;

        return this;
    }

    /**
     * @inheritdoc
     */
    setPlural(number) {
        this._plural = number;

        return this;
    }

    /**
     * @inheritdoc
     */
    setCode(code) {
        this._code = code;

        return this;
    }

    /**
     * @inheritdoc
     */
    setCause(cause) {
        this._cause = cause;

        return this;
    }

    /**
     * @inheritdoc
     */
    addViolation() {
        let translatedMessage;
        if (null === this._plural) {
            translatedMessage = this._translator.trans(
                this._message,
                this._parameters,
                this._translationDomain
            );
        } else {
            translatedMessage = this._translator.trans(
                this._message,
                { ...this._parameters, '%count%': this._plural },
                this._translationDomain
            );
        }

        this._violations.add(new ConstraintViolation(
            translatedMessage,
            this._message,
            this._parameters,
            this._root,
            this._propertyPath,
            this._invalidValue,
            this._plural,
            this._code,
            this._constraint,
            this._cause
        ));
    }
}
