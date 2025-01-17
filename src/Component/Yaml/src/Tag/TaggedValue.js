/**
 * @memberOf Jymfony.Component.Yaml.Tag
 */
export default class TaggedValue {
    /**
     * @type {string}
     *
     * @private
     */
    _tag;

    /**
     * @type {*}
     *
     * @private
     */
    _value;

    /**
     * Constructor.
     *
     * @param {string} tag
     * @param {*} value
     */
    __construct(tag, value) {
        this._tag = tag;
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
