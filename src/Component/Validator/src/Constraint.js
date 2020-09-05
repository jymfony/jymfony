const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;
const InvalidOptionsException = Jymfony.Component.Validator.Exception.InvalidOptionsException;
const MissingOptionsException = Jymfony.Component.Validator.Exception.MissingOptionsException;

/**
 * Contains the properties of a constraint definition.
 *
 * A constraint can be defined on a class, a property or a getter method.
 * The Constraint class encapsulates all the configuration required for
 * validating this class, property or getter result successfully.
 *
 * Constraint instances are immutable and serializable.
 *
 * @memberOf Jymfony.Component.Validator
 * @abstract
 */
export default class Constraint {
    /**
     * Returns the name of the given error code.
     *
     * @param {string} errorCode The error code
     *
     * @returns {string} The name of the error code
     *
     * @throws {Jymfony.Component.Validator.Exception.InvalidArgumentException} If the error code does not exist
     */
    static getErrorName(errorCode) {
        throw new InvalidArgumentException(__jymfony.sprintf('The error code "%s" does not exist.', errorCode));
    }

    /**
     * Initializes the constraint with options.
     *
     * You should pass an object. The keys should be the names of
     * existing properties in this class. The values should be the value for these
     * properties.
     *
     * Alternatively you can override the method defaultOption to return the
     * name of an existing property. If no object is passed, this
     * property is set instead.
     *
     * You can force that certain options are set by overriding
     * requiredOptions to return the names of these options. If any
     * option is not set here, an exception is thrown.
     *
     * @param {*} options The options (as object) or the value for the default option (any other type)
     *
     * @throws {Jymfony.Component.Validator.Exception.InvalidOptionsException} When you pass the names of non-existing options
     * @throws {Jymfony.Component.Validator.Exception.MissingOptionsException} When you don't pass any of the options returned by requiredOptions
     * @throws {Jymfony.Component.Validator.Exception.ConstraintDefinitionException} When you don't pass an object, but defaultOption returns null
     */
    __construct(options = null) {
        /**
         * Domain-specific data attached to a constraint.
         *
         * @type {*}
         */
        this.payload = null;

        /**
         * Groups
         *
         * @type {null|string[]}
         */
        this._groups = [ __self.DEFAULT_GROUP ];

        const defaultOption = this.defaultOption;
        const invalidOptions = [];
        const missingOptions = this.requiredOptions.reduce((res, cur) => (res[cur] = true, res), {});

        const reflClass = new ReflectionClass(this);
        const knownOptions = [ ...reflClass.fields, ...reflClass.properties ];

        // The "groups" option is added to the object lazily
        knownOptions.push('groups');

        if (isObjectLiteral(options) && options.value && ! reflClass.hasField('value')) {
            if (! defaultOption) {
                throw new ConstraintDefinitionException(__jymfony.sprintf('No default option is configured for constraint "%s".', reflClass.name));
            }

            options[defaultOption] = options.value;
            delete options.value;
        }

        const proxy = this.__wakeup();
        if (isObjectLiteral(options)) {
            for (const [ option, value ] of __jymfony.getEntries(options)) {
                if (knownOptions.includes(option)) {
                    if (reflClass.hasField(option)) {
                        const field = reflClass.getField(option);
                        field.setValue(proxy, value);
                    } else {
                        const property = reflClass.getWritableProperty(option);
                        property.invoke(proxy, value);
                    }

                    delete missingOptions[option];
                } else {
                    invalidOptions.push(option);
                }
            }
        } else if (null !== options) {
            if (null === defaultOption) {
                throw new ConstraintDefinitionException(__jymfony.sprintf('No default option is configured for constraint "%s".', reflClass.name));
            }

            if (knownOptions.includes(defaultOption)) {
                const field = reflClass.getField(defaultOption);
                field.setValue(proxy, options);

                delete missingOptions[defaultOption];
            } else {
                invalidOptions.push(defaultOption);
            }
        }

        if (0 < invalidOptions.length) {
            throw new InvalidOptionsException(__jymfony.sprintf('The options "%s" do not exist in constraint "%s".', invalidOptions.join('", "'), reflClass.name), invalidOptions);
        }

        if (0 < Object.keys(missingOptions).length) {
            throw new MissingOptionsException(__jymfony.sprintf('The options "%s" must be set for constraint "%s".', Object.keys(missingOptions).join('", "'), reflClass.name), Object.keys(missingOptions));
        }

        return proxy;
    }

    /**
     * Gets the constraint groups.
     *
     * @returns {null|string[]}
     */
    get groups() {
        return this._groups;
    }

    /**
     * Sets the constraint groups.
     *
     * @param {string[]} groups
     */
    set groups(groups) {
        this._groups = isArray(groups) ? [ ...groups ] : [ groups ];
    }

    /**
     * Adds the given group if this constraint is in the Default group.
     *
     * @param {string} group
     */
    addImplicitGroupName(group) {
        if (-1 !== this._groups.indexOf(__self.DEFAULT_GROUP) && -1 === this._groups.indexOf(group)) {
            this._groups.push(group);
        }
    }

    /**
     * Returns the name of the default option.
     *
     * Override this method to define a default option.
     *
     * @returns {string|null}
     *
     * @see __construct()
     */
    get defaultOption() {
        return null;
    }

    /**
     * Returns the name of the required options.
     *
     * Override this method if you want to define required options.
     *
     * @returns {string[]}
     *
     * @see __construct()
     */
    get requiredOptions() {
        return [];
    }

    /**
     * Returns the name of the class that validates this constraint.
     *
     * By default, this is the fully qualified name of the constraint class
     * suffixed with "Validator". You can override this method to change that
     * behavior.
     *
     * @returns {string}
     */
    get validatedBy() {
        return (new ReflectionClass(this)).name + 'Validator';
    }

    /**
     * Returns whether the constraint can be put onto classes, properties or
     * both.
     *
     * This method should return one or more of the constants
     * Constraint.CLASS_CONSTRAINT and Constraint.PROPERTY_CONSTRAINT.
     *
     * @returns {string|string[]} One or more constant values
     */
    get targets() {
        return __self.PROPERTY_CONSTRAINT;
    }

    /**
     * Optimizes the serialized value to minimize storage space.
     *
     * @returns {string[]} The properties to serialize
     *
     * @internal
     */
    __sleep() {
        const reflClass = new ReflectionClass(this);

        return reflClass.fields;
    }

    /**
     * Wakes up from serialization.
     *
     * @returns {Constraint}
     *
     * @internal
     */
    __wakeup() {
        return new Proxy(this, {
            set(target, p, value) {
                if ('groups' === p) {
                    target._groups = isArray(value) ? value : [ value ];
                    return true;
                }

                if (Reflect.has(target, p)) {
                    Reflect.set(target, p, value);
                    return true;
                }

                throw new InvalidOptionsException(__jymfony.sprintf('The option "%s" does not exist in constraint "%s".', p, reflClass.name), [ p ]);
            },
        });
    }
}

/**
 * The name of the group given to all constraints with no explicit group.
 */
Object.defineProperty(Constraint, 'DEFAULT_GROUP', { writable: false, value: 'Default' });

/**
 * Marks a constraint that can be put onto classes.
 */
Object.defineProperty(Constraint, 'CLASS_CONSTRAINT', { writable: false, value: 'class' });

/**
 * Marks a constraint that can be put onto properties.
 */
Object.defineProperty(Constraint, 'PROPERTY_CONSTRAINT', { writable: false, value: 'property' });
