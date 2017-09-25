const AccessException = Jymfony.Component.OptionsResolver.Exception.AccessException;
const InvalidArgumentException = Jymfony.Component.OptionsResolver.Exception.InvalidArgumentException;
const InvalidOptionsException = Jymfony.Component.OptionsResolver.Exception.InvalidOptionsException;
const MissingOptionsException = Jymfony.Component.OptionsResolver.Exception.MissingOptionsException;
const NoSuchOptionException = Jymfony.Component.OptionsResolver.Exception.NoSuchOptionException;
const OptionDefinitionException = Jymfony.Component.OptionsResolver.Exception.OptionDefinitionException;
const UndefinedOptionsException = Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException;

/**
 * Validates options and merges them with default values.
 *
 * @memberOf Jymfony.Component.OptionsResolver
 */
class OptionsResolver {
    __construct() {
        /**
         * The names of all defined options.
         *
         * @type {Object<string, boolean>}
         * @private
         */
        this._defined = {};

        /**
         * The default option values.
         *
         * @type {Object<string, *>}
         * @private
         */
        this._defaults = {};

        /**
         * The names of required options.
         *
         * @type {Object<string, boolean>}
         * @private
         */
        this._required = {};

        /**
         * The resolved option values.
         *
         * @type {Object<string, *>}
         * @private
         */
        this._resolved = {};

        /**
         * A list of normalizer closures.
         *
         * @type {Object<string, Function>}
         * @private
         */
        this._normalizers = {};

        /**
         * A list of accepted values for each option.
         *
         * @type {Object<string, [*]>}
         * @private
         */
        this._allowedValues = {};

        /**
         * A list of accepted types for each option.
         *
         * @type {Object<string, [string|Function]>}
         * @private
         */
        this._allowedTypes = {};

        /**
         * A list of closures for evaluating lazy options.
         *
         * @type {Object<string, [Function]>}
         * @private
         */
        this._lazy = {};

        /**
         * A list of lazy options whose closure is currently being called.
         *
         * This list helps detecting circular dependencies between lazy options.
         *
         * @type {Object<string, boolean>}
         * @private
         */
        this._calling = {};

        /**
         * Whether the instance is locked for reading.
         *
         * Once locked, the options cannot be changed anymore. This is
         * necessary in order to avoid inconsistencies during the resolving
         * process. If any option is changed after being read, all evaluated
         * lazy options that depend on this option would become invalid.
         *
         * @type {boolean}
         * @private
         */
        this._locked = false;

        return new Proxy(this, {
            get: (target, key) => {
                if (Reflect.has(target, key)) {
                    return Reflect.get(target, key);
                }

                return this.get(key);
            },
            has: (target, key) => {
                return Reflect.has(target, key) || this.has(key);
            },
        });
    }

    /**
     * Returns the number of set options.
     *
     * This may be only a subset of the defined options.
     *
     * @returns {int} Number of options
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If accessing this method outside of {@link resolve()}
     */
    get length() {
        if (! this._locked) {
            throw new AccessException('Counting is only supported within closures of lazy options and normalizers.');
        }

        return Object.keys(this._defaults).length;
    }

    /**
     * Sets the default value of a given option.
     *
     * @param {string} option The name of the option
     * @param {*} value The default value of the option
     * @param {boolean} lazy If the option should be lazy-evaluated
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     * @throws {Jymfony.Component.OptionsResolver.Exception.InvalidArgumentException} If lazy is true, but value is not a function
     */
    setDefault(option, value, lazy = false) {
        if (this._locked) {
            throw new AccessException('Default values cannot be set from a lazy option or normalizer.');
        }

        if (lazy) {
            if (!isFunction(value)) {
                throw new InvalidArgumentException('Lazy-evaluated options must have a function as value');
            }

            delete this._resolved[option];

            if (! this._defaults.hasOwnProperty(option)) {
                this._defaults[option] = undefined;
            }

            if (undefined === this._lazy[option]) {
                this._lazy[option] = [];
            }

            this._lazy[option].push(value);
        } else {
            delete this._lazy[option];
            this._resolved[option] = value;
            this._defaults[option] = value;
        }

        this._defined[option] = true;

        return this;
    }

    /**
     * Sets a list of default values.
     *
     * @param {Object<string, *>} defaults The default values to set
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    setDefaults(defaults) {
        for (const [ option, value ] of __jymfony.getEntries(defaults)) {
            this.setDefault(option, value);
        }

        return this;
    }

    /**
     * Returns whether a default value is set for an option.
     *
     * Returns true if {@link setDefault()} was called for this option.
     * An option is also considered set if it was set to null.
     *
     * @param {string} option The option name
     *
     * @returns {boolean} Whether a default value is set
     */
    hasDefault(option) {
        return this._defaults.hasOwnProperty(option);
    }

    /**
     * Marks one or more options as required.
     *
     * @param {string|[string]} optionNames One or more option names
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    setRequired(optionNames) {
        if (this._locked) {
            throw new AccessException('Options cannot be made required from a lazy option or normalizer.');
        }

        if (! isArray(optionNames)) {
            optionNames = [ optionNames ];
        }

        for (const option of optionNames) {
            this._defined[option] = true;
            this._required[option] = true;
        }

        return this;
    }

    /**
     * Returns whether an option is required.
     *
     * An option is required if it was passed to {@link setRequired()}.
     *
     * @param {string} option The name of the option
     *
     * @returns {boolean} Whether the option is required
     */
    isRequired(option) {
        return !! this._required[option];
    }

    /**
     * Returns the names of all required options.
     *
     * @returns {[string]} The names of the required options
     *
     * @see isRequired()
     */
    getRequiredOptions() {
        return Object.keys(this._required);
    }

    /**
     * Returns whether an option is missing a default value.
     *
     * An option is missing if it was passed to {@link setRequired()}, but not
     * to {@link setDefault()}. This option must be passed explicitly to
     * {@link resolve()}, otherwise an exception will be thrown.
     *
     * @param {string} option The name of the option
     *
     * @returns {boolean} Whether the option is missing
     */
    isMissing(option) {
        return !! this._required[option] && ! this._defaults.hasOwnProperty(option);
    }

    /**
     * Returns the names of all options missing a default value.
     *
     * @returns {[string]} The names of the missing options
     *
     * @see isMissing()
     */
    getMissingOptions() {
        return Object.keys(this._required).filter(key => ! this._defaults.hasOwnProperty(key));
    }

    /**
     * Defines a valid option name.
     *
     * Defines an option name without setting a default value. The option will
     * be accepted when passed to {@link resolve()}. When not passed, the
     * option will not be included in the resolved options.
     *
     * @param {string|[string]} optionNames One or more option names
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    setDefined(optionNames) {
        if (this._locked) {
            throw new AccessException('Options cannot be defined from a lazy option or normalizer.');
        }

        if (! isArray(optionNames)) {
            optionNames = [ optionNames ];
        }

        for (const option of optionNames) {
            this._defined[option] = true;
        }

        return this;
    }

    /**
     * Returns whether an option is defined.
     *
     * Returns true for any option passed to {@link setDefault()},
     * {@link setRequired()} or {@link setDefined()}.
     *
     * @param {string} option The option name
     *
     * @returns {boolean} Whether the option is defined
     */
    isDefined(option) {
        return this._defined[option];
    }

    /**
     * Returns the names of all defined options.
     *
     * @returns {[string]} The names of the defined options
     *
     * @see isDefined()
     */
    getDefinedOptions() {
        return Object.keys(this._defined);
    }

    /**
     * Sets the normalizer for an option.
     *
     * The normalizer should be a closure with the following signature:
     *
     * ```js
     * function (options, value) {
     *     // ...
     * }
     * ```
     *
     * The closure is invoked when {@link resolve()} is called. The closure
     * has access to the resolved values of other options through the passed
     * {@link Options} instance.
     *
     * The second parameter passed to the closure is the value of
     * the option.
     *
     * The resolved option value is set to the return value of the closure.
     *
     * @param {string} option     The option name
     * @param {Function} normalizer The normalizer
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If the option is undefined
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    setNormalizer(option, normalizer) {
        if (this._locked) {
            throw new AccessException('Normalizers cannot be set from a lazy option or normalizer.');
        }

        if (! this._defined[option]) {
            throw new UndefinedOptionsException(__jymfony.sprintf(
                'The option "%s" does not exist. Defined options are: "%s".',
                option, Object.keys(this._defined).join('", "')
            ));
        }

        this._normalizers[option] = normalizer;

        // Make sure the option is processed
        delete this._resolved[option];

        return this;
    }

    /**
     * Sets allowed values for an option.
     *
     * Instead of passing values, you may also pass a closures with the
     * following signature:
     *
     *     function (value) {
     *         // return true or false
     *     }
     *
     * The closure receives the value as argument and should return true to
     * accept the value and false to reject the value.
     *
     * @param {string} option The option name
     * @param {*} allowedValues One or more acceptable values/closures
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If the option is undefined
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    setAllowedValues(option, allowedValues) {
        if (this._locked) {
            throw new AccessException('Allowed values cannot be set from a lazy option or normalizer.');
        }

        if (! this._defined[option]) {
            throw new UndefinedOptionsException(__jymfony.sprintf(
                'The option "%s" does not exist. Defined options are: "%s".',
                option, Object.keys(this._defined).join('", "')
            ));
        }

        this._allowedValues[option] = isArray(allowedValues) ? [ ...allowedValues ] : [ allowedValues ];

        // Make sure the option is processed
        delete this._resolved[option];

        return this;
    }

    /**
     * Adds allowed values for an option.
     *
     * The values are merged with the allowed values defined previously.
     *
     * Instead of passing values, you may also pass a closures with the
     * following signature:
     *
     *     function (value) {
     *         // return true or false
     *     }
     *
     * The closure receives the value as argument and should return true to
     * accept the value and false to reject the value.
     *
     * @param {string} option        The option name
     * @param {*} allowedValues One or more acceptable values/closures
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If the option is undefined
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    addAllowedValues(option, allowedValues) {
        if (this._locked) {
            throw new AccessException('Allowed values cannot be added from a lazy option or normalizer.');
        }

        if (! this._defined[option]) {
            throw new UndefinedOptionsException(__jymfony.sprintf(
                'The option "%s" does not exist. Defined options are: "%s".',
                option, Object.keys(this._defined).join('", "')
            ));
        }

        if (! isArray(allowedValues)) {
            allowedValues = [ allowedValues ];
        }

        if (! this._allowedValues[option]) {
            this._allowedValues[option] = [ ...allowedValues ];
        } else {
            this._allowedValues.splice(-1, 0, allowedValues);
        }

        // Make sure the option is processed
        delete this._resolved[option];

        return this;
    }

    /**
     * Sets allowed types for an option.
     *
     * Any type for which a corresponding is_<type>() function exists is
     * acceptable. Additionally, fully-qualified class or interface names may
     * be passed.
     *
     * @param {string} option       The option name
     * @param {string|[string]} allowedTypes One or more accepted types
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If the option is undefined
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    setAllowedTypes(option, allowedTypes) {
        if (this._locked) {
            throw new AccessException('Allowed types cannot be set from a lazy option or normalizer.');
        }

        if (! this._defined[option]) {
            throw new UndefinedOptionsException(sprintf(
                'The option "%s" does not exist. Defined options are: "%s".',
                option, Object.keys(this._defined).join('", "')
            ));
        }

        this._allowedTypes[option] = isArray(allowedTypes) ? [ ...allowedTypes ] : [ allowedTypes ];

        // Make sure the option is processed
        delete this._resolved[option];

        return this;
    }

    /**
     * Adds allowed types for an option.
     *
     * The types are merged with the allowed types defined previously.
     *
     * Any type for which a corresponding is_<type>() function exists is
     * acceptable. Additionally, fully-qualified class or interface names may
     * be passed.
     *
     * @param {string} option The option name
     * @param {string|[string]} allowedTypes One or more accepted types
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If the option is undefined
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    addAllowedTypes(option, allowedTypes) {
        if (this._locked) {
            throw new AccessException('Allowed types cannot be added from a lazy option or normalizer.');
        }

        if (! this._defined[option]) {
            throw new UndefinedOptionsException(__jymfony.sprintf(
                'The option "%s" does not exist. Defined options are: "%s".',
                option, Object.keys(this._defined).join('", "')
            ));
        }

        if (! isArray(allowedTypes)) {
            allowedTypes = [ allowedTypes ];
        }

        if (! this._allowedTypes[option]) {
            this._allowedTypes[option] = [ ...allowedTypes ];
        } else {
            this._allowedTypes[option].splice(-1, 0, allowedTypes);
        }

        // Make sure the option is processed
        delete this._resolved[option];

        return this;
    }

    /**
     * Removes the option with the given name.
     *
     * Undefined options are ignored.
     *
     * @param {string|[string]} optionNames One or more option names
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    remove(optionNames) {
        if (this._locked) {
            throw new AccessException('Options cannot be removed from a lazy option or normalizer.');
        }

        if (! isArray(optionNames)) {
            optionNames = [ optionNames ];
        }

        for (const option of optionNames) {
            delete this._defined[option];
            delete this._defaults[option];
            delete this._required[option];
            delete this._resolved[option];
            delete this._lazy[option];
            delete this._normalizers[option];
            delete this._allowedTypes[option];
            delete this._allowedValues[option];
        }

        return this;
    }

    /**
     * Removes all options.
     *
     * @returns {Jymfony.Component.OptionsResolver.OptionsResolver}
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    clear() {
        if (this._locked) {
            throw new AccessException('Options cannot be cleared from a lazy option or normalizer.');
        }

        this._defined = {};
        this._defaults = {};
        this._required = {};
        this._resolved = {};
        this._lazy = {};
        this._normalizers = {};
        this._allowedTypes = {};
        this._allowedValues = {};

        return this;
    }

    /**
     * Merges options with the default values stored in the container and
     * validates them.
     *
     * Exceptions are thrown if:
     *
     *  - Undefined options are passed;
     *  - Required options are missing;
     *  - Options have invalid types;
     *  - Options have invalid values.
     *
     * @param {Object<string, *>} options A map of option names to values
     *
     * @returns {Object<string, *>} The merged and validated options
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If an option name is undefined
     * @throws {Jymfony.Component.OptionsResolver.Exception.InvalidOptionsException} If an option doesn't fulfill the specified validation rules
     * @throws {Jymfony.Component.OptionsResolver.Exception.MissingOptionsException} If a required option is missing
     * @throws {Jymfony.Component.OptionsResolver.Exception.OptionDefinitionException} If there is a cyclic dependency between lazy options and/or normalizers
     * @throws {Jymfony.Component.OptionsResolver.Exception.NoSuchOptionException} If a lazy option reads an unavailable option
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
     */
    resolve(options = {}) {
        if (this._locked) {
            throw new AccessException('Options cannot be resolved from a lazy option or normalizer.');
        }

        // Allow this method to be called multiple times
        const clone = __jymfony.clone(this);

        // Make sure that no unknown options are passed
        let diff = Object.keys(options).filter(key => ! clone._defined.hasOwnProperty(key));

        if (0 < diff.length) {
            throw new UndefinedOptionsException(__jymfony.sprintf(
                (1 < diff.length ? 'The options "%s" do not exist.' : 'The option "%s" does not exist.') +
                ' Defined options are: "%s".',
                diff.sort().join('", "'),
                Object.keys(clone._defined).sort().join('", "')
            ));
        }

        // Override options set by the user
        for (const [ option, value ] of __jymfony.getEntries(options)) {
            clone._defaults[option] = value;

            delete clone._resolved[option];
            delete clone._lazy[option];
        }

        // Check whether any required option is missing
        diff = Object.keys(clone._required).filter(key => ! clone._defaults.hasOwnProperty(key));

        if (0 < diff.length) {
            throw new MissingOptionsException(__jymfony.sprintf(
                1 < diff.length ? 'The required options "%s" are missing.' : 'The required option "%s" is missing.',
                diff.join('", "')
            ));
        }

        // Lock the container
        clone._locked = true;

        // Now process the individual options. Use get(), which resolves
        // The option itself and any options that the option depends on
        for (const option of Object.keys(clone._defaults)) {
            clone.get(option);
        }

        return clone._resolved;
    }

    /**
     * Returns the resolved value of an option.
     *
     * @param {string} option The option name
     *
     * @returns {*} The option value
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If accessing this method outside of {@link resolve()}
     * @throws {Jymfony.Component.OptionsResolver.Exception.NoSuchOptionException} If the option is not set
     * @throws {Jymfony.Component.OptionsResolver.Exception.InvalidOptionsException} If the option doesn't fulfill the specified validation rules
     * @throws {Jymfony.Component.OptionsResolver.Exception.OptionDefinitionException} If there is a cyclic dependency between lazy options and/or normalizers
     */
    get(option) {
        if (! this._locked) {
            throw new AccessException('Array access is only supported within closures of lazy options and normalizers.');
        }

        // Shortcut for resolved options
        if (this._resolved.hasOwnProperty(option)) {
            return this._resolved[option];
        }

        // Check whether the option is set at all
        if (! this._defaults.hasOwnProperty(option)) {
            if (! this._defined[option]) {
                throw new NoSuchOptionException(__jymfony.sprintf(
                    'The option "%s" does not exist. Defined options are: "%s".',
                    option, Object.keys(this._defined).join('", "')
                ));
            }

            throw new NoSuchOptionException(
                `The optional option "${option}" has no value set. You should make sure it is set with "isset" before reading it.`
            );
        }

        let value = this._defaults[option];

        // Resolve the option if the default value is lazily evaluated
        if (this._lazy[option]) {
            // If the closure is already being called, we have a cyclic
            // Dependency
            if (this._calling[option]) {
                throw new OptionDefinitionException(sprintf(
                    'The options "%s" have a cyclic dependency.',
                    Object.keys(this._calling).join('", "')
                ));
            }

            // The following section must be protected from cyclic
            // Calls. Set $calling for the current $option to detect a cyclic
            // Dependency
            // BEGIN
            this._calling[option] = true;
            try {
                for (const closure of this._lazy[option]) {
                    value = closure(this, value);
                }
            } finally {
                delete this._calling[option];
            }
            // END
        }

        // Validate the type of the resolved option
        if (this._allowedTypes[option]) {
            let valid = false;

            for (const type of this._allowedTypes[option]) {
                if (isString(type)) {
                    if (type === typeof value) {
                        valid = true;
                        break;
                    }

                    continue;
                }

                if (value instanceof type) {
                    valid = true;
                    break;
                }
            }

            if (! valid) {
                throw new InvalidOptionsException(__jymfony.sprintf(
                    'The option "%s" with value %s is expected to be of type ' +
                    '"%s", but is of type "%s".',
                    option,
                    this._formatValue(value),
                    this._allowedTypes[option].join('" or "'),
                    this._formatTypeOf(value)
                ));
            }
        }

        // Validate the value of the resolved option
        if (this._allowedValues[option]) {
            let success = false;
            const printableAllowedValues = [];

            for (const allowedValue of this._allowedValues[option]) {
                if (isFunction(allowedValue)) {
                    if (allowedValue(value)) {
                        success = true;
                        break;
                    }

                    // Don't include closures in the exception message
                    continue;
                } else if (value === allowedValue) {
                    success = true;
                    break;
                }

                printableAllowedValues.push(allowedValue);
            }

            if (! success) {
                let message = __jymfony.sprintf(
                    'The option "%s" with value %s is invalid.',
                    option,
                    this._formatValue(value)
                );

                if (0 < printableAllowedValues.length) {
                    message += __jymfony.sprintf(
                        ' Accepted values are: %s.',
                        this._formatValues(printableAllowedValues)
                    );
                }

                throw new InvalidOptionsException(message);
            }
        }

        // Normalize the validated option
        if (this._normalizers[option]) {
            // If the closure is already being called, we have a cyclic
            // Dependency
            if (this._calling[option]) {
                throw new OptionDefinitionException(__jymfony.sprintf(
                    'The options "%s" have a cyclic dependency.',
                    Object.keys(this._calling).join('", "')
                ));
            }

            const normalizer = this._normalizers[option];

            // The following section must be protected from cyclic
            // Calls. Set $calling for the current $option to detect a cyclic
            // Dependency
            // BEGIN
            this._calling[option] = true;
            try {
                value = normalizer(this, value);
            } finally {
                delete this._calling[option];
            }
            // END
        }

        // Mark as resolved
        this._resolved[option] = value;

        return value;
    }

    /**
     * Returns whether a resolved option with the given name exists.
     *
     * @param {string} option The option name
     *
     * @returns {boolean} Whether the option is set
     *
     * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If accessing this method outside of {@link resolve()}
     */
    has(option) {
        if (! this._locked) {
            throw new AccessException('Has method is only supported within closures of lazy options and normalizers.');
        }

        return this._defaults.hasOwnProperty(option);
    }

    /**
     * Returns a string representation of the type of the value.
     *
     * This method should be used if you pass the type of a value as
     * message parameter to a constraint violation. Note that such
     * parameters should usually not be included in messages aimed at
     * non-technical people.
     *
     * @param {*} value The value to return the type of
     *
     * @returns {string} The type of the value
     *
     * @private
     */
    _formatTypeOf(value) {
        return isObject(value) && ! isObjectLiteral(value) ? new ReflectionClass(value).name : typeof value;
    }

    /**
     * Returns a string representation of the value.
     *
     * This method returns the equivalent PHP tokens for most scalar types
     * (i.e. "false" for false, "1" for 1 etc.). Strings are always wrapped
     * in double quotes (").
     *
     * @param {*} value The value to format as string
     *
     * @returns {string} The string representation of the passed value
     *
     * @private
     */
    _formatValue(value) {
        if (isArray(value)) {
            return 'array';
        }

        if (isObjectLiteral(value)) {
            return 'object';
        }

        if (isObject(value)) {
            return new ReflectionClass(value).name;
        }

        if (isString(value)) {
            return '"' + value + '"';
        }

        if (null === value) {
            return 'null';
        }

        if (undefined === value) {
            return 'undefined';
        }

        if (false === value) {
            return 'false';
        }

        if (true === value) {
            return 'true';
        }

        return value.toString();
    }

    /**
     * Returns a string representation of a list of values.
     *
     * Each of the values is converted to a string using
     * {@link formatValue()}. The values are then concatenated with commas.
     *
     * @params {[*]} values A list of values
     *
     * @returns {string} The string representation of the value list
     *
     * @see formatValue()
     *
     * @private
     */
    _formatValues(values) {
        return values.map(this._formatValue).join(', ');
    }
}

module.exports = OptionsResolver;
