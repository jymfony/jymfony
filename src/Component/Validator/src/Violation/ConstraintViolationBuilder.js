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
        /**
         * @type {Jymfony.Component.Validator.ConstraintViolationListInterface}
         *
         * @private
         */
        this._violations = violations;

        /**
         * @type {string}
         *
         * @private
         */
        this._message = message;

        /**
         * @type {Object<string, *>}
         *
         * @private
         */
        this._parameters = parameters;

        /**
         * @type {*}
         *
         * @private
         */
        this._root = root;

        /**
         * @type {string}
         *
         * @private
         */
        this._propertyPath = propertyPath;

        /**
         * @type {*}
         *
         * @private
         */
        this._invalidValue = invalidValue;

        /**
         * @type {Jymfony.Contracts.Translation.TranslatorInterface}
         *
         * @private
         */
        this._translator = translator;

        /**
         * @type {string}
         *
         * @private
         */
        this._translationDomain = translationDomain;

        /**
         * @type {Jymfony.Component.Validator.Constraint}
         *
         * @private
         */
        this._constraint = constraint;

        /**
         * @type {string}
         *
         * @private
         */
        this._code = undefined;

        /**
         * @type {*}
         *
         * @private
         */
        this._cause = undefined;

        /**
         * @type {number}
         *
         * @private
         */
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
