const FirewallMapInterface = Jymfony.Component.Security.Firewall.FirewallMapInterface;
const FirewallConfig = Jymfony.Component.Security.Firewall.FirewallConfig;

/**
 * FirewallMap allows configuration of different firewalls for specific parts of the application.
 *
 * @memberOf Jymfony.Component.Security.Firewall
 */
export default class FirewallMap extends implementationOf(FirewallMapInterface) {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Jymfony.Component.Security.Firewall.FirewallConfig[]}
         *
         * @private
         */
        this._map = [];
    }

    /**
     * Adds a firewall to this map.
     *
     * @param {Jymfony.Component.Security.Firewall.FirewallConfig} config
     */
    add(config) {
        this._map.push(config);
    }

    /**
     * @inheritdoc
     */
    getConfig(request) {
        for (const config of this._map) {
            const requestMatcher = config.requestMatcher;
            if (! requestMatcher || requestMatcher.matches(request)) {
                return config;
            }
        }

        return new FirewallConfig();
    }
}
