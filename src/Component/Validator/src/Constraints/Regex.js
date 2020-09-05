const Constraint = Jymfony.Component.Validator.Constraint;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class Regex extends Constraint {
    /**
     * @inheritdoc
     */
    static getErrorName(errorCode) {
        if (__self.REGEX_FAILED_ERROR === errorCode) {
            return 'REGEX_FAILED_ERROR';
        }

        return Constraint.getErrorName(errorCode);
    }

    /**
     * @inheritdoc
     */
    __construct(options = null) {
        this.message = 'This value is not valid.';
        /** @type {RegExp} */
        this.pattern = undefined;
        this.htmlPattern = undefined;
        this.match = true;
        this.normalizer = undefined;

        const ret = super.__construct(options);

        if (undefined !== this.normalizer && ! isFunction(this.normalizer)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "normalizer" option must be a valid callable ("%s" given).', __jymfony.get_debug_type(this.normalizer)));
        }

        return ret;
    }

    /**
     * @inheritdoc
     */
    get defaultOption() {
        return 'pattern';
    }

    /**
     * @inheritdoc
     */
    get requiredOptions() {
        return [ 'pattern' ];
    }

    /**
     * Converts the htmlPattern to a suitable format for HTML5 pattern.
     * Example: /^[a-z]+$/ would be converted to [a-z]+
     * However, if options are specified, it cannot be converted.
     *
     * Pattern is also ignored if match=false since the pattern should
     * then be reversed before application.
     *
     * @see http://dev.w3.org/html5/spec/single-page.html#the-pattern-attribute
     *
     * @returns {string|null}
     */
    getHtmlPattern() {
        // If htmlPattern is specified, use it
        if (!! this.htmlPattern) {
            return this.htmlPattern || null;
        }

        let pattern = this.pattern.source;

        // Quit if delimiters not at very beginning/end (e.g. when options are passed)
        if (!! this.pattern.flags) {
            return null;
        }

        // Unescape the delimiter
        pattern = pattern.replace(/\\\//g, '/');

        // If the pattern is inverted, we can wrap it in
        // ((?!pattern).)*
        if (! this.match) {
            return '((?!' + pattern + ').)*';
        }

        // If the pattern contains an or statement, wrap the pattern in
        // .*(pattern).* and quit. Otherwise we'd need to parse the pattern
        if (-1 !== pattern.indexOf('|')) {
            return '.*(' + pattern + ').*';
        }

        // Trim leading ^, otherwise prepend .*
        pattern = '^' === pattern[0] ? pattern.substr(1) : '.*' + pattern;

        // Trim trailing $, otherwise append .*
        pattern = '$' === pattern[pattern.length - 1] ? pattern.substr(0, pattern.length - 1) : pattern + '.*';

        return pattern;
    }
}

Object.defineProperty(Regex, 'REGEX_FAILED_ERROR', { value: 'de1e3db3-5ed4-4941-aae4-59f3667cc3a3', writable: false });
