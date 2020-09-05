const ConstraintDefinitionException = Jymfony.Component.Validator.Exception.ConstraintDefinitionException;
const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const DateTime = Jymfony.Component.DateTime.DateTime;
const Range = Jymfony.Component.Validator.Constraints.Range;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class RangeValidator extends ConstraintValidator {
    /**
     * Constructor
     *
     * @param {Jymfony.Contracts.PropertyAccess.PropertyAccessorInterface} [propertyAccessor]
     */
    __construct(propertyAccessor = undefined) {
        super.__construct();

        /**
         * @type {Jymfony.Contracts.PropertyAccess.PropertyAccessorInterface}
         *
         * @private
         */
        this._propertyAccessor = propertyAccessor;
    }

    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Range)) {
            throw new UnexpectedTypeException(constraint, Range);
        }

        if (null === value || undefined === value) {
            return;
        }

        if (! isNumeric(value) && ! (value instanceof Date) && ! (value instanceof DateTime)) {
            this._context.buildViolation(constraint.invalidMessage)
                .setParameter('{{ value }}', this._formatValue(value, __self.PRETTY_DATE))
                .setCode(Range.INVALID_CHARACTERS_ERROR)
                .addViolation();

            return;
        }

        let min = this._getLimit(constraint.minPropertyPath, constraint.min, constraint);
        let max = this._getLimit(constraint.maxPropertyPath, constraint.max, constraint);
        let comparand = value;
        let compare = (a, b) => {
            if (a == b) {
                return 0;
            }

            return a > b ? 1 : -1;
        };

        if (value instanceof Date || value instanceof DateTime) {
            const getValue = val => val instanceof DateTime ? val : new DateTime(val);
            comparand = value instanceof DateTime ? value.copy() : new DateTime(value);

            const numCompare = compare;
            compare = (a, b) => {
                const unixCompare = numCompare(a.timestamp, b.timestamp);
                if (0 === unixCompare) {
                    return numCompare(a.millisecond, b.millisecond);
                }

                return unixCompare;
            };

            if (undefined !== min && null !== min) {
                try {
                    min = getValue(min);
                } catch (e) {
                    throw new ConstraintDefinitionException(__jymfony.sprintf('The min value "%s" could not be converted to a DateTime instance in the "%s" constraint.', min, __jymfony.get_debug_type(constraint)));
                }
            }

            if (undefined !== max && null !== max) {
                try {
                    max = getValue(max);
                } catch (e) {
                    throw new ConstraintDefinitionException(__jymfony.sprintf('The max value "%s" could not be converted to a DateTime instance in the "%s" constraint.', max, __jymfony.get_debug_type(constraint)));
                }
            }
        }

        const hasLowerLimit = null !== min && undefined !== min;
        const hasUpperLimit = null !== max && undefined !== max;

        if (hasLowerLimit && hasUpperLimit && (-1 === compare(comparand, min) || 1 === compare(comparand, max))) {
            const violationBuilder = this._context.buildViolation(constraint.notInRangeMessage)
                .setParameter('{{ value }}', this._formatValue(value, __self.PRETTY_DATE))
                .setParameter('{{ min }}', this._formatValue(min, __self.PRETTY_DATE))
                .setParameter('{{ max }}', this._formatValue(max, __self.PRETTY_DATE))
                .setCode(Range.NOT_IN_RANGE_ERROR);

            if (!! constraint.maxPropertyPath) {
                violationBuilder.setParameter('{{ max_limit_path }}', constraint.maxPropertyPath);
            }

            if (!! constraint.minPropertyPath) {
                violationBuilder.setParameter('{{ min_limit_path }}', constraint.minPropertyPath);
            }

            violationBuilder.addViolation();

            return;
        }

        if (hasUpperLimit && 1 === compare(comparand, max)) {
            const violationBuilder = this._context.buildViolation(constraint.maxMessage)
                .setParameter('{{ value }}', this._formatValue(value, __self.PRETTY_DATE))
                .setParameter('{{ limit }}', this._formatValue(max, __self.PRETTY_DATE))
                .setCode(Range.TOO_HIGH_ERROR);

            if (!! constraint.maxPropertyPath) {
                violationBuilder.setParameter('{{ max_limit_path }}', constraint.maxPropertyPath);
            }

            if (!! constraint.minPropertyPath) {
                violationBuilder.setParameter('{{ min_limit_path }}', constraint.minPropertyPath);
            }

            violationBuilder.addViolation();

            return;
        }

        if (hasLowerLimit && -1 === compare(comparand, min)) {
            const violationBuilder = this._context.buildViolation(constraint.minMessage)
                .setParameter('{{ value }}', this._formatValue(value, __self.PRETTY_DATE))
                .setParameter('{{ limit }}', this._formatValue(min, __self.PRETTY_DATE))
                .setCode(Range.TOO_LOW_ERROR);

            if (!! constraint.maxPropertyPath) {
                violationBuilder.setParameter('{{ max_limit_path }}', constraint.maxPropertyPath);
            }

            if (!! constraint.minPropertyPath) {
                violationBuilder.setParameter('{{ min_limit_path }}', constraint.minPropertyPath);
            }

            violationBuilder.addViolation();
        }
    }

    /**
     * Gets the limit from specified by property path.
     *
     * @param {string|Jymfony.Contracts.PropertyAccess.PropertyPathInterface} propertyPath
     * @param {*} $default
     * @param {Jymfony.Component.Validator.Constraints.Range} constraint
     *
     * @returns {*}
     *
     * @private
     */
    _getLimit(propertyPath, $default, constraint) {
        if (! propertyPath) {
            return $default;
        }

        const object = this._context.object;
        if (undefined === object || null === object) {
            return $default;
        }

        try {
            return this._getPropertyAccessor().getValue(object, propertyPath);
        } catch (e) {
            if (e instanceof Jymfony.Component.PropertyAccess.Exception.NoSuchPropertyException) {
                throw new ConstraintDefinitionException(__jymfony.sprintf('Invalid property path "%s" provided to "%s" constraint: %s.', propertyPath, __jymfony.get_debug_type(constraint), e.message), 0, e);
            }

            throw e;
        }
    }

    /**
     * Gets an instance of property accessor.
     *
     * @returns {Jymfony.Contracts.PropertyAccess.PropertyAccessorInterface}
     *
     * @private
     */
    _getPropertyAccessor() {
        if (! this._propertyAccessor) {
            this._propertyAccessor = new Jymfony.Component.PropertyAccess.PropertyAccessor();
        }

        return this._propertyAccessor;
    }
}
