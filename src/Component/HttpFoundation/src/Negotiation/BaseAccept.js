/**
 * Base class for Accept headers.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 * @abstract
 */
export default class BaseAccept {
    /**
     * Constructor.
     *
     * @param {string} value
     */
    __construct(value) {
        /**
         * @type {number}
         *
         * @private
         */
        this._quality = 1.0;

        /**
         * @type {string}
         *
         * @private
         */
        this._normalized = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._value = undefined;

        /**
         * @type {Object.<string, *>}
         *
         * @private
         */
        this._parameters = {};

        /**
         * @type {string}
         *
         * @protected
         */
        this._type = undefined;

        const [ type, parameters ] = this._parseParameters(value);

        if (parameters.q) {
            this._quality = Number(parameters.q);

            delete parameters.q;
        }

        this._value = value;
        this._normalized = type + (0 < Object.keys(parameters).length ? '; ' + this._buildParametersString(parameters) : '');
        this._type = __jymfony.trim(type.toLowerCase());
        this._parameters = parameters;
    }

    /**
     * The normalized value.
     *
     * @returns {string}
     */
    get normalizedValue() {
        return this._normalized;
    }

    /**
     * The raw value.
     *
     * @returns {string}
     */
    get value() {
        return this._value;
    }

    /**
     * The type.
     *
     * @returns {string}
     */
    get type() {
        return this._type;
    }

    /**
     * The accept quality.
     *
     * @returns {number}
     */
    get quality() {
        return this._quality;
    }

    /**
     * The accept header parameters.
     *
     * @returns {Object.<string, *>}
     */
    get parameters() {
        return Object.assign({}, this._parameters);
    }

    /**
     * Gets a specific parameter.
     *
     * @param {string} key
     * @param {*} [defaultValue]
     *
     * @returns {string|undefined}
     */
    getParameter(key, defaultValue = undefined) {
        return undefined !== this._parameters[key] ? this._parameters[key] : defaultValue;
    }

    /**
     * Whether the accept header has the specified parameter.
     *
     * @param {string} key
     *
     * @returns {boolean}
     */
    hasParameter(key) {
        return undefined !== this._parameters[key];
    }

    /**
     * Parses the accept part parameters.
     *
     * @param {string} acceptPart
     *
     * @returns {[string, Object.<string, string>]}
     *
     * @private
     */
    _parseParameters(acceptPart) {
        const parts = acceptPart.split(';');
        const type = parts.shift();

        const parameters = {};
        for (let part of parts) {
            part = part.split('=');

            if (2 !== part.length) {
                continue;
            }

            const key = __jymfony.trim(part[0]).toLowerCase(); // TODO: technically not allowed space around "=". throw exception?
            parameters[key] = __jymfony.trim(part[1], ' "');
        }

        return [ type, parameters ];
    }

    /**
     * Builds a parameters string.
     *
     * @param {Object.<string, string>} parameters
     *
     * @returns {string}
     *
     * @private
     */
    _buildParametersString(parameters) {
        const parts = [];

        parameters = Object.ksort(parameters);
        for (const [ key, val ] of __jymfony.getEntries(parameters)) {
            parts.push(__jymfony.sprintf('%s=%s', key, val));
        }

        return parts.join('; ');
    }
}
