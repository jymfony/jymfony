const Ip = Jymfony.Component.HttpFoundation.Ip;
const RequestMatcherInterface = Jymfony.Component.HttpFoundation.RequestMatcherInterface;

/**
 * Compares a pre-defined set of checks against a Request object.
 *
 * @memberOf Jymfony.Component.HttpFoundation
 */
export default class RequestMatcher extends implementationOf(RequestMatcherInterface) {
    /**
     * Constructor.
     *
     * @param {string} [path]
     * @param {string} [host]
     * @param {string|string[]} [methods]
     * @param {string|string[]} [ips = []]
     * @param {Object.<string, *>} [attributes = {}]
     * @param {string|string[]} [schemes]
     */
    __construct(path = undefined, host = undefined, methods = undefined, ips = [], attributes = {}, schemes = undefined) {
        /**
         * @type {string}
         *
         * @private
         */
        this._path = path;

        /**
         * @type {string}
         *
         * @private
         */
        this._host = host;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._methods = undefined === methods || isArray(methods) ? methods : [ methods ];
        if (isArray(this._methods)) {
            this._methods = this._methods.map(method => method.toUpperCase());
        }

        /**
         * @type {string[]}
         *
         * @private
         */
        this._ips = isArray(ips) ? ips : [ ips ];

        /**
         * @type {Object<string, *>}
         *
         * @private
         */
        this._attributes = attributes;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._schemes = undefined === schemes || isArray(schemes) ? schemes : [ schemes ];
    }

    /**
     * @inheritdoc
     */
    matches(request) {
        if (undefined !== this._schemes && -1 === this._schemes.indexOf(request.scheme)) {
            return false;
        }

        if (undefined !== this._methods && -1 === this._methods.indexOf(request.method)) {
            return false;
        }

        const attributes = request.attributes;
        for (const [ key, value ] of __jymfony.getEntries(this._attributes)) {
            if (attributes.has(key) && ! attributes.get(key).toString().match(new RegExp(value))) {
                return false;
            }
        }

        if (undefined !== this._path && ! decodeURIComponent(request.pathInfo).match(new RegExp(this._path))) {
            return false;
        }

        if (undefined !== this._host && ! request.host.match(new RegExp(this._host, 'i'))) {
            return false;
        }

        if (Ip.check(request.clientIp, this._ips)) {
            return true;
        }

        return 0 === this._ips.length;
    }
}
