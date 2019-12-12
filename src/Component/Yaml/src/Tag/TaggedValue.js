/**
 * @memberOf Jymfony.Component.Yaml.Tag
 */
export default class TaggedValue {
    /**
     * Constructor.
     *
     * @param {string} tag
     * @param {*} value
     */
    __construct(tag, value) {
        /**
         * @type {string}
         *
         * @private
         */
        this._tag = tag;

        /**
         * @type {*}
         *
         * @private
         */
        this._value = value;
    }

    /**
     * Gets the tag.
     *
     * @returns {string}
     */
    get tag() {
        return this._tag;
    }

    /**
     * Gets the value.
     *
     * @returns {*}
     */
    get value() {
        return this._value;
    }
}
