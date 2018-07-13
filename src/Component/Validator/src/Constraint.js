const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const InvalidArgumentException = Jymfony.Component.Validator.Exception.InvalidArgumentException;
const InvalidOptionsException = Jymfony.Component.Validator.Exception.InvalidOptionsException;
const MissingOptionsException = Jymfony.Component.Validator.Exception.MissingOptionsException;

/**
 * Maps error codes to the names of their constants.
 */
let _errorNames = [];

/**
 * Contains the properties of a constraint definition.
 *
 * A constraint can be defined on a class, a property or a getter method.
 * The Constraint class encapsulates all the configuration required for
 * validating this class, property or getter result successfully.
 *
 * Constraint instances are immutable and serializable.
 *
 * @property array $groups The groups that the constraint belongs to
 *
 * @memberOf Jymfony.Component.Validator
 */
class Constraint {
    /**
     * Returns the name of the given error code.
     *
     * @param {string} errorCode The error code
     *
     * @return {string} The name of the error code
     *
     * @throws {Jymfony.Component.Validator.Exception.InvalidArgumentException} If the error code does not exist
     */
    static getErrorName(errorCode) {
        if (! _errorNames[errorCode]) {
            throw new InvalidArgumentException(__jymfony.sprintf(
                'The error code "%s" does not exist for constraint of type "%s".',
                errorCode,
                __self
            ));
        }

        return _errorNames[errorCode];
    }

    /**
     * Initializes the constraint with options.
     *
     * You should pass an associative array. The keys should be the names of
     * existing properties in this class. The values should be the value for these
     * properties.
     *
     * Alternatively you can override the method getDefaultOption() to return the
     * name of an existing property. If no associative array is passed, this
     * property is set instead.
     *
     * You can force that certain options are set by overriding
     * getRequiredOptions() to return the names of these options. If any
     * option is not set here, an exception is thrown.
     *
     * @param {Object} [options = null] The options (as associative array) or the value for the default option (any other type)
     *
     * @throws {Jymfony.Component.Validator.Exception.InvalidOptionsException} When you pass the names of non-existing options
     * @throws {Jymfony.Component.Validator.Exception.MissingOptionsException} When you don't pass any of the options returned by getRequiredOptions()
     * @throws {Jymfony.Component.Validator.Exception.ConstraintDefinitionException} When you don't pass an associative array, but getDefaultOption() returns null
     */
    __construct(options = null) {
        /**
         * Domain-specific data attached to a constraint.
         *
         * @var {*}
         */
        this.payload = undefined;

        let invalidOptions = {};
        let missingOptions = {};
        for (const [key, value] of __jymfony.getEntries(this.getRequiredOptions())){
            missingOptions[value] = key;
        }

        let knownOptions = {};
        //$knownOptions = get_object_vars($this);

        // The "groups" option is added to the object lazily
        knownOptions['groups'] = true;

        if (isObject(options) && 1 <= options.length && !! options.value  && ! this.value) {
            options[this.getDefaultOption()] = options.value;
            delete options.value;
        }

        if (isObject(options) && 0 < options.length && typeof options.keys[0] === 'string') {
            for (const [option, value] of __jymfony.getEntries(options)) {
                if (!! knownOptions[option]) {
                    this[option] = value;
                    delete missingOptions[option];
                } else {
                    invalidOptions.push(option);
                }
            }
        } else if (!! options && !(isArray(options) && 0 === options.length)) {
            let option = this.getDefaultOption();

            if (null === option) {
                throw new ConstraintDefinitionException(__jymfony.sprintf(
                    'No default option is configured for constraint %s',
                    __self
                ));
            }

            if (!! knownOptions.option) {
                this[option] = options;
                delete missingOptions[option];
            } else {
                invalidOptions.push(option);
            }
        }

        if (0 < invalidOptions.length) {
            throw new InvalidOptionsException(
                __jymfony.sprintf('The options "%s" do not exist in constraint %s', invalidOptions.join('", "'), __self),
                invalidOptions
            );
        }

        if (0 < missingOptions) {
            throw new MissingOptionsException(
                __jymfony.sprintf('The options "%s" must be set for constraint %s', Object.keys(missingOptions).join('", "'), __self),
                Object.keys(missingOptions)
            );
        }
    }

    /**
     * Sets the value of a lazily initialized option.
     *
     * Corresponding properties are added to the object on first access. Hence
     * this method will be called at most once per constraint instance and
     * option name.
     *
     * @param {string} option The option name
     * @param {*} value The value to set
     *
     * @throws InvalidOptionsException If an invalid option name is given
     */
    setValue(option, value) {
        if ('groups' === option) {
            this.groups = value;

            return;
        }

        throw new InvalidOptionsException(
            __jymfony.sprintf('The option "%s" does not exist in constraint %s', option, __self),
            option
        );
    }

    /**
     * Returns the value of a lazily initialized option.
     *
     * Corresponding properties are added to the object on first access. Hence
     * this method will be called at most once per constraint instance and
     * option name.
     *
     * @param string $option The option name
     *
     * @return mixed The value of the option
     *
     * @throws InvalidOptionsException If an invalid option name is given
     *
     * @internal this method should not be used or overwritten in userland code
     */
    public function __get($option)
{
    if ('groups' === $option) {
        $this->groups = array(__self.DEFAULT_GROUP);

        return $this->groups;
    }

    throw new InvalidOptionsException(sprintf('The option "%s" does not exist in constraint %s', $option, get_class($this)), array($option));
}

    /**
     * @param string $option The option name
     *
     * @return bool
     */
    public function __isset($option)
{
    return 'groups' === $option;
}

    /**
     * Adds the given group if this constraint is in the Default group.
     *
     * @param string $group
     */
    public function addImplicitGroupName($group)
{
    if (in_array(self::DEFAULT_GROUP, $this->groups) && !in_array($group, $this->groups)) {
        $this->groups[] = $group;
    }
}

    /**
     * Returns the name of the default option.
     *
     * Override this method to define a default option.
     *
     * @return string
     *
     * @see __construct()
     */
    public function getDefaultOption()
{
}

    /**
     * Returns the name of the required options.
     *
     * Override this method if you want to define required options.
     *
     * @return array
     *
     * @see __construct()
     */
    public function getRequiredOptions()
{
    return array();
}

    /**
     * Returns the name of the class that validates this constraint.
     *
     * By default, this is the fully qualified name of the constraint class
     * suffixed with "Validator". You can override this method to change that
     * behaviour.
     *
     * @return {string}
     */
    validatedBy() {
        return ReflectionClass.getClassName(this) + 'Validator';
    }

    /**
     * Returns whether the constraint can be put onto classes, properties or both.
     *
     * This method should return one or more of the constants
     * Constraint.CLASS_CONSTRAINT and Constraint.PROPERTY_CONSTRAINT.
     *
     * @return {string|string[]} One or more constant values
     */
    getTargets() {
        return __self.PROPERTY_CONSTRAINT;
    }
}

/**
 * The name of the group given to all constraints with no explicit group.
 */
Constraint.DEFAULT_GROUP = 'Default';

/**
 * Marks a constraint that can be put onto classes.
 */
Constraint.CLASS_CONSTRAINT = 'class';

/**
 * Marks a constraint that can be put onto properties.
 */
Constraint.PROPERTY_CONSTRAINT = 'property';
