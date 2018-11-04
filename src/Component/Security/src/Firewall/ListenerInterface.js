/**
 * @memberOf Jymfony.Component.Security.Firewall
 */
class ListenerInterface {
    /**
     * Handles a request.
     *
     * @param {Jymfony.Component.HttpServer.Event.GetResponseEvent} event
     *
     * @returns {Promise<void>}
     */
    async handle(event) { }
}

module.exports = getInterface(ListenerInterface);
