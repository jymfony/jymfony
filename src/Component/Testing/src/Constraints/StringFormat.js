import path from 'path';

const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * Constraint that asserts that the string it is evaluated for matches
 * a given string format.
 *
 * The pattern string passed in the constructor.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 */
export default class StringFormat extends Constraint {
    /**
     * Constructor.
     *
     * @param {string} format
     */
    __construct(format) {
        /**
         * @type {string}
         *
         * @private
         */
        this._format = format;
    }

    /**
     * @inheritdoc
     */
    toString() {
        return __jymfony.sprintf('matches format "%s"', this._format);
    }

    /**
     * @inheritdoc
     */
    matches(other) {
        const regex = new RegExp('^' + __jymfony.strtr(__jymfony.regex_quote(this._format), {
            '/': '\\/',
            '%%': '%',
            '%e': '\\' + path.sep,
            '%s': '[^\\r\\n]+',
            '%S': '[^\\r\\n]*',
            '%a': '.+',
            '%A': '.*',
            '%w': '\\s*',
            '%i': '[+-]?\\d+',
            '%d': '\\d+',
            '%x': '[0-9a-fA-F]+',
            '%f': '[+-]?\\.?\\d+\\.?\\d*(?:[Ee][+-]?\\d+)?',
            '%c': '.',
        }) + '$', 's');

        return regex.test(other);
    }
}
