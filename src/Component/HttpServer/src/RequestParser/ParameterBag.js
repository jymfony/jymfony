/**
 * @memberOf Jymfony.Component.HttpServer.RequestParser
 */
export default class ParameterBag {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Map}
         *
         * @private
         */
        this._bag = new Map();
    }

    /**
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        if (this._bag.has(key)) {
            const prev = this._bag.get(key);

            if (! isArray(prev)) {
                this._bag.set(key, [ prev, value ]);
            } else {
                prev.push(value);
            }
        } else {
            this._bag.set(key, value);
        }
    }

    /**
     * @param {string} key
     *
     * @returns {*}
     */
    get(key) {
        return this._bag.get(key);
    }

    /**
     * @returns {Object}
     */
    toObject() {
        const obj = {};
        this._bag.forEach((v, k) => obj[k] = v);

        return obj;
    }
}
