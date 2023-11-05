const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
const ConstraintValidatorInterface = Jymfony.Component.Validator.ConstraintValidatorInterface;

/**
 * Base class for constraint validators.
 *
 * @memberOf Jymfony.Component.Validator
 * @abstract
 */
export default class ConstraintValidator extends implementationOf(ConstraintValidatorInterface) {
    /**
     * @type {Jymfony.Component.Validator.Context.ExecutionContextInterface}
     *
     * @protected
     */
    _context;

    /**
     * @inheritDoc
     */
    initialize(context) {
        this._context = context;
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
     * @protected
     */
    _formatTypeOf(value) {
        if (isObjectLiteral(value)) {
            return 'object';
        }

        if (null === value) {
            return 'null';
        }

        if (isObject(value)) {
            return (new ReflectionClass(value)).name;
        }

        return typeof value;
    }

    /**
     * Returns a string representation of the value.
     *
     * This method returns the equivalent js tokens for most scalar types
     * (i.e. "false" for false, "1" for 1 etc.). Strings are always wrapped
     * in double quotes ("). Objects, arrays and resources are formatted as
     * "object", "array" and "resource". If the $format bitmask contains
     * the PRETTY_DATE bit, then {@link Jymfony.Contracts.DateTime.DateTimeInterface}
     * objects will be formatted as RFC-3339 dates ("Y-m-d H:i:s").
     *
     * Be careful when passing message parameters to a constraint violation
     * that (may) contain objects, arrays or resources. These parameters
     * should only be displayed for technical users. Non-technical users
     * won't know what an "object", "array" or "resource" is and will be
     * confused by the violation message.
     *
     * @param {*} value The value to format as string
     * @param {int} format A bitwise combination of the format constants in this class
     *
     * @returns {string} The string representation of the passed value
     *
     * @protected
     */
    _formatValue(value, format = 0) {
        value = value instanceof Date ? new DateTime(value) : value;
        const isDateTime = value instanceof DateTimeInterface;

        if ((format & __self.PRETTY_DATE) && isDateTime) {
            try {
                const utcValue = value.setTimeZone(DateTimeZone.get('Etc/UTC'));
                const formatter = new Intl.DateTimeFormat(this._context.validator.locale, {
                    timeZone: value.timezone.name || 'Etc/UTC',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                });

                return formatter.format(Date.UTC(utcValue.year, utcValue.month - 1, utcValue.day, utcValue.hour, utcValue.minute, utcValue.second, utcValue.millisecond));
            } catch (e) {
                return value.format('M d, y h:i a');
            }
        }

        if (isArray(value)) {
            return 'array';
        }

        if (isObject(value)) {
            if ((format & __self.OBJECT_TO_STRING) && isFunction(value.toString)) {
                return value.toString();
            }

            return 'object';
        }

        if (isString(value)) {
            return '"' + value + '"';
        }

        if (undefined === value) {
            return 'undefined';
        }

        if (null === value) {
            return 'null';
        }

        if (false === value) {
            return 'false';
        }

        if (true === value) {
            return 'true';
        }

        return String(value);
    }

    /**
     * Returns a string representation of a list of values.
     *
     * Each of the values is converted to a string using
     * {@link _formatValue()}. The values are then concatenated with commas.
     *
     * @param {*[]} values A list of values
     * @param {int} format A bitwise combination of the format
     *                     constants in this class
     *
     * @returns {string} The string representation of the value list
     *
     * @see _formatValue()
     *
     * @protected
     */
    _formatValues(values, format = 0) {
        for (const [ key, value ] of __jymfony.getEntries(values)) {
            values[key] = this._formatValue(value, format);
        }

        return values.join(', ');
    }
}

Object.defineProperties(ConstraintValidator, {
    /**
     * Whether to format {@link Jymfony.Contracts.DateTime.DateTimeInterface} objects as RFC-3339 dates ("Y-m-d H:i:s").
     */
    PRETTY_DATE: { writable: false, value: 1 },

    /**
     * Whether to cast objects with a "toString()" method to strings.
     */
    OBJECT_TO_STRING: { writable: false, value: 2 },
});
