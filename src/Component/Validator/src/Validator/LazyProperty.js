/**
 * A wrapper for a callable initializing a property from a getter.
 *
 * @memberOf Jymfony.Component.Validator.Validator
 * @internal
 */
export default class LazyProperty {
    /**
     * @type {Function}
     * @private
     */
    _propertyValueCallback;

    /**
     * Constructor.
     *
     * @param {Function} propertyValueCallback
     */
    __construct(propertyValueCallback) {
        this._propertyValueCallback = propertyValueCallback;
    }

    getPropertyValue() {
        return this._propertyValueCallback();
    }
}
