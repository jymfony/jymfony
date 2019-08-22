/**
 * @memberOf Jymfony.Component.Security.Firewall
 */
class FirewallMapInterface {
    /**
     * Returns the firewall configuration matching the request.
     *
     * @param {Jymfony.Component.HttpFoundation.Request} request
     *
     * @returns {Jymfony.Component.Security.Firewall.FirewallConfig}
     */
    getConfig(request) { }
}

export default getInterface(FirewallMapInterface);
