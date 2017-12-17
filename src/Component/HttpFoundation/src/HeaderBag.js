/**
 * @memberOf Jymfony.Component.HttpFoundation
 */
class HeaderBag {
    __construct(headers = {}) {
        /**
         * @type {Object<string, [string]>}
         * @private
         */
        this._headers = {};

        /**
         * @type {Object<string, int|string|boolean>}
         * @private
         */
        this._cacheControl = {};

        for (const [ k, v ] of __jymfony.getEntries(headers)) {
            this.set(k, v);
        }
    }

    /**
     * Returns the headers as a string.
     *
     * @returns {string} The headers
     */
    toString() {
        const headers = this.all;

        Object.ksort(headers);
        const max = Math.max(...Object.keys(headers).map(hdr => hdr.length)) + 1;
        let content = '';
        for (let [ name, values ] of __jymfony.getEntries(headers)) {
            name = __jymfony.ucwords(name, '-');
            for (const value of values) {
                content += __jymfony.sprintf('%-'+max+'s %s\r\n', name+':', value);
            }
        }

        return content;
    }

    /**
     * Gets a copy of the parameters collection.
     *
     * @returns {Object<string, *>}
     */
    get all() {
        return Object.assign({}, this._headers);
    }

    /**
     * Gets the parameters keys.
     *
     * @returns {[string]}
     */
    get keys() {
        return Object.keys(this._headers);
    }

    /**
     * Adds/replaces parameters in the bag.
     *
     * @param {Object<string, *>} parameters
     */
    add(parameters) {
        Object.assign(this._headers, parameters);
    }

    /**
     * Gets a parameter or returns the default if the parameter is non existent.
     *
     * @param {string} key
     * @param {*} defaultValue
     * @param {boolean} first
     *
     * @returns {*|string|undefined}
     */
    get(key, defaultValue = undefined, first = true) {
        key = key.toLowerCase().replace(/_/g, '-');

        const val = this.has(key) ? this._headers[key] : defaultValue;
        if (first && isArray(val)) {
            return val[0];
        } else if (! first && ! isArray(val)) {
            return [ val ];
        }

        return val;
    }

    /**
     * Sets/overwrite a parameter in the bag.
     *
     * @param {string} key
     * @param {*} values
     * @param {boolean} replace
     */
    set(key, values, replace = true) {
        key = key.toLowerCase().replace(/_/g, '-');

        if (isArray(values)) {
            if (true === replace || undefined === this._headers[key]) {
                this._headers[key] = values;
            } else {
                this._headers[key] = this._headers[key].concat(values);
            }
        } else {
            if (true === replace || undefined === this._headers[key]) {
                this._headers[key] = [ values ];
            } else {
                this._headers[key].push(values);
            }
        }

        if ('cache-control' === key) {
            this._cacheControl = this._parseCacheControl(this._headers[key].join(', '));
        }
    }

    /**
     * Checks whether a parameter is present in the bag.
     *
     * @param {string} key
     *
     * @returns {boolean}
     */
    has(key) {
        return this._headers.hasOwnProperty(key.toLowerCase().replace(/_/g, '-'));
    }

    /**
     * Deletes a parameter.
     *
     * @param {string} key
     */
    remove(key) {
        key = key.toLowerCase().replace(/_/g, '-');

        delete this._headers[key];

        if ('cache-control' === key) {
            this._cacheControl = {};
        }
    }

    /**
     * Gets a key/value iterator.
     *
     * @returns {Generator}
     */
    * [Symbol.iterator]() {
        yield * __jymfony.getEntries(this._headers);
    }

    /**
     * Gets the number of elements in the bag.
     *
     * @returns {int}
     */
    get length() {
        return Object.keys(this._headers).length;
    }

    get cookies() {
        return this.get('cookie', '')
            .split('; ')
            .map(str => str.split('=', 2))
            .reduce((res, val) => (res[val[0]] = val[1], res), {});
    }

    get cacheControlHeader() {
        const parts = [];
        Object.ksort(this._cacheControl);
        for (let [ key, value ] of this._cacheControl) {
            if (true === value) {
                parts.push(key);
            } else {
                if (value.match(/[^a-zA-Z0-9._-]/)) {
                    value = '"'+value+'"';
                }

                parts.push(key + '=' + value);
            }
        }

        return parts.join(', ');
    }

    /**
     * Parses a Cache-Control HTTP header.
     *
     * @param {string} header The value of the Cache-Control HTTP header
     *
     * @returns {Object<string, int|string|boolean>} An array representing the attribute values
     *
     * @protected
     */
    _parseCacheControl(header) {
        const cacheControl = {};
        const regex = /([a-zA-Z][a-zA-Z_-]*)\s*(?:=(?:"([^"]*)"|([^ \t",;]*)))?/g;
        let match;

        while (match = regex.exec(header)) {
            cacheControl[match[1].toLowerCase()] = match[3] || match[2] || true;
        }

        return cacheControl;
    }
}

module.exports = HeaderBag;
