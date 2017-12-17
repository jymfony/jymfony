/**
 * @memberOf Jymfony.Component.HttpServer.RequestParser
 */
class ParameterBag {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Map}
         * @private
         */
        this._bag = new Map();
    }

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

    get(key) {
        return this._bag.get(key);
    }

    toObject() {
        const obj = {};
        this._bag.forEach((v, k) => obj[k] = v);

        return obj;
    }
}

module.exports = ParameterBag;
