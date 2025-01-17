const AccessException = Jymfony.Contracts.PropertyAccess.Exception.AccessException;
const AbstractComparison = Jymfony.Component.Validator.Constraints.AbstractComparison;
const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 *
 * @abstract
 */
export default class AbstractComparisonValidator extends ConstraintValidator {
    /**
     * @type {Jymfony.Contracts.PropertyAccess.PropertyAccessorInterface}
     *
     * @private
     */
    _propertyAccessor;

    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.PropertyAccess.PropertyAccessorInterface} propertyAccessor
     */
    __construct(propertyAccessor = null) {
        super.__construct();

        this._propertyAccessor = propertyAccessor;
    }

    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof AbstractComparison)) {
            throw new UnexpectedTypeException(constraint, AbstractComparison);
        }

        if (null === value || undefined === value) {
            return;
        }

        let comparedValue;
        const path = constraint.propertyPath;
        if (path) {
            const object = this._context.object;
            if (! object) {
                return;
            }

            try {
                comparedValue = this._getPropertyAccessor().getValue(object, path);
            } catch (e) {
                if (e instanceof AccessException) {
                    throw new ConstraintDefinitionException(__jymfony.sprintf('Invalid property path "%s" provided to "%s" constraint: ', path, __jymfony.get_debug_type(constraint)) + e.message, 0, e);
                }
            }
        } else {
            comparedValue = constraint.value;
        }

        const originalValue = value;
        const originalComparedValue = comparedValue;

        // Convert strings to DateTimes if comparing another DateTime
        // This allows to compare with any date/time value supported by the DateTime constructor
        if (isString(comparedValue) && (value instanceof DateTimeInterface || value instanceof Date)) {
            const dateTimeClass = ReflectionClass.getClassName(value);
            value = (value instanceof Date ? new DateTime(value) : value).microtime;

            try {
                comparedValue = new DateTime(comparedValue).microtime;
            } catch {
                throw new ConstraintDefinitionException(__jymfony.sprintf('The compared value "%s" could not be converted to a "%s" instance in the "%s" constraint.', comparedValue, dateTimeClass, __jymfony.get_debug_type(constraint)));
            }
        }

        if ((value instanceof Date || value instanceof DateTimeInterface) && (comparedValue instanceof Date || comparedValue instanceof DateTimeInterface)) {
            value = (new DateTime(value)).microtime;
            comparedValue = (new DateTime(comparedValue)).microtime;
        }

        if (! this._compareValues(value, comparedValue)) {
            const violationBuilder = this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(originalValue, __self.OBJECT_TO_STRING | __self.PRETTY_DATE))
                .setParameter('{{ compared_value }}', this._formatValue(originalComparedValue, __self.OBJECT_TO_STRING | __self.PRETTY_DATE))
                .setParameter('{{ compared_value_type }}', this._formatTypeOf(originalComparedValue))
                .setCode(this._getErrorCode());

            if (undefined !== path) {
                violationBuilder.setParameter('{{ compared_value_path }}', path);
            }

            violationBuilder.addViolation();
        }
    }

    /**
     * Gets a property accessor instance.
     *
     * @returns {Jymfony.Contracts.PropertyAccess.PropertyAccessorInterface}
     *
     * @private
     */
    _getPropertyAccessor() {
        if (null === this._propertyAccessor) {
            this._propertyAccessor = new Jymfony.Component.PropertyAccess.PropertyAccessor();
        }

        return this._propertyAccessor;
    }

    /**
     * Compares the two given values to find if their relationship is valid.
     *
     * @param {*} value1 The first value to compare
     * @param {*} value2 The second value to compare
     *
     * @returns {boolean} true if the relationship is valid, false otherwise
     *
     * @protected
     * @abstract
     */
    _compareValues(value1, value2) { // eslint-disable-line no-unused-vars
        throw new Error('_compareValues must be implemented');
    }

    /**
     * Returns the error code used if the comparison fails.
     *
     * @returns {string|null} The error code or `null` if no code should be set
     */
    _getErrorCode() {
        return null;
    }
}
