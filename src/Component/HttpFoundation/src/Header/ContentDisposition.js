/**
 * @memberOf Jymfony.Component.HttpFoundation.Header
 */
export default class ContentDisposition {
    /**
     * Constructor.
     *
     * @param {string} disposition
     */
    __construct(disposition) {
        this._parse(disposition);
    }

    /**
     * Gets the content disposition type (ex: inline, form-data, ...)
     *
     * @returns {string}
     */
    get type() {
        return this._type;
    }

    /**
     * Gets a content type parameter (ex: charset).
     *
     * @param {string} parameter
     * @param {undefined|string} [defaultValue]
     *
     * @returns {string}
     */
    get(parameter, defaultValue = undefined) {
        return this._parameters[parameter] || defaultValue;
    }

    /**
     * Checks whether a parameter is present.
     *
     * @param {string} parameter
     *
     * @returns {boolean}
     */
    has(parameter) {
        return this._parameters.hasOwnProperty(parameter);
    }

    /**
     * Parses and validates the the content-type header.
     *
     * @param {string} disposition
     *
     * @protected
     */
    _parse(disposition) {
        const [ t, ...params ] = disposition.split(';')
            .map(str => __jymfony.trim(str.toLowerCase()));

        this._type = t;
        this._parameters = params
            .map(str => {
                const kv = str.split('=', 2).map(str => __jymfony.trim(str));
                kv[1] = kv[1].replace(/^"(.+)"$/, '$1');

                return kv;
            })
            .reduce((res, val) => (res[val[0]] = val[1], res), {});
    }
}

module.exports = ContentDisposition;
