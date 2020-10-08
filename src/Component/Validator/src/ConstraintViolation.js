const ConstraintViolationInterface = Jymfony.Component.Validator.ConstraintViolationInterface;

/**
 * Default implementation of {@ConstraintViolationInterface}.
 *
 * @memberOf Jymfony.Component.Validator
 */
export default class ConstraintViolation extends implementationOf(ConstraintViolationInterface) {
    /**
     * Creates a new constraint violation.
     *
     * @param {string|object} message The violation message as a string or a stringable object
     * @param {string} messageTemplate The raw violation message
     * @param {Object.<string, *>} parameters The parameters to substitute in the raw violation message
     * @param {*} root The value originally passed to the validator
     * @param {string} propertyPath The property path from the root value to the invalid value
     * @param {*} invalidValue The invalid value that caused this violation
     * @param {int|null} plural The number for determining the plural form when translating the message
     * @param {string|null} code The error code of the violation
     * @param {Jymfony.Component.Validator.Constraint} constraint The failed constraint
     * @param {*} cause The cause of the violation
     */
    __construct(message, messageTemplate, parameters, root, propertyPath, invalidValue, plural = null, code = null, constraint = null, cause = null) {
        if (! isString(message) && !(isObject(message) && !isFunction(message, 'toString'))) {
            throw new InvalidArgumentException('Constraint violation message should be a string or an object which implements the toString() method.');
        }

        /**
         * @type {string}
         *
         * @private
         */
        this._message = String(message);

        /**
         * @type {null|string}
         *
         * @private
         */
        this._messageTemplate = messageTemplate;

        /**
         * @type {Object<string, *>}
         *
         * @private
         */
        this._parameters = parameters;

        /**
         * @type {int|null}
         *
         * @private
         */
        this._plural = plural;

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
        this._code = code;

        /**
         * @type {*}
         *
         * @private
         */
        this._cause = cause;
    }

    /**
     * Converts the violation into a string for debugging purposes.
     *
     * @returns {string} The violation as string
     */
    toString() {
        let $class;
        if (isObjectLiteral(this._root)) {
            $class = 'Object';
        } else if (isObject(this._root)) {
            $class = 'Object(' + ReflectionClass.getClassName(this._root) + ')';
        } else if (isArray(this._root)) {
            $class = 'Array';
        } else {
            $class = String(this._root);
        }

        const propertyPath = this._propertyPath ? String(this._propertyPath) : '';

        if ('' !== propertyPath && '[' !== propertyPath[0] && '' !== $class) {
            $class += '.';
        }

        let code = this._code || '';
        if ('' !== code) {
            code = ' (code ' + code + ')';
        }

        return $class + propertyPath + ':\n    ' + this.message + code;
    }

    /**
     * @inheritdoc
     */
    get messageTemplate() {
        return this._messageTemplate;
    }

    /**
     * @inheritdoc
     */
    get parameters() {
        return { ...this._parameters };
    }

    /**
     * @inheritdoc
     */
    get plural() {
        return this._plural;
    }

    /**
     * @inheritdoc
     */
    get message() {
        return this._message;
    }

    /**
     * @inheritdoc
     */
    get root() {
        return this._root;
    }

    /**
     * @inheritdoc
     */
    get propertyPath() {
        return this._propertyPath;
    }

    /**
     * @inheritdoc
     */
    get invalidValue() {
        return this._invalidValue;
    }

    /**
     * Returns the constraint whose validation caused the violation.
     *
     * @returns {Jymfony.Component.Validator.Constraint|null} The constraint or null if it is not known
     */
    get constraint() {
        return this._constraint;
    }

    /**
     * Returns the cause of the violation.
     *
     * @returns {*}
     */
    get cause() {
        return this._cause;
    }

    /**
     * @inheritdoc
     */
    get code() {
        return this._code;
    }
}
