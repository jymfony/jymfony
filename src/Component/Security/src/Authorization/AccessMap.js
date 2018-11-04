const AccessMapInterface = Jymfony.Component.Security.Authorization.AccessMapInterface;

/**
 * AccessMap allows configuration of different access control rules for
 * specific parts of the website.
 *
 * @memberOf Jymfony.Component.Security.Authorization
 */
class AccessMap extends implementationOf(AccessMapInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {[Jymfony.Component.HttpFoundation.RequestMatcherInterface, string[], undefined|string]}
         *
         * @private
         */
        this._map = [];
    }

    /**
     * Adds a request matcher to the access map.
     *
     * @param {Jymfony.Component.HttpFoundation.RequestMatcherInterface} requestMatcher A RequestMatcherInterface instance
     * @param {string[]} [attributes = []] An array of attributes to pass to the access decision manager (like roles)
     * @param {undefined|string} [channel] The channel to enforce (http, https)
     */
    add(requestMatcher, attributes = [], channel = undefined) {
        this._map.push([ requestMatcher, attributes, channel ]);
    }

    /**
     * @inheritdoc
     */
    getPatterns(request) {
        for (const element of this._map) {
            if (element[0].matches(request)) {
                return [ element[1], element[2] ];
            }
        }

        return [ undefined, undefined ];
    }
}

module.exports = AccessMap;
