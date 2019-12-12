/**
 * @memberOf Jymfony.Component.Security.Firewall
 */
class ListenerInterface {
    /**
     * Handles a request.
     *
     * @param {Jymfony.Contracts.HttpServer.Event.RequestEvent} event
     *
     * @returns {Promise<void>}
     */
    async handle(event) { }
}

export default getInterface(ListenerInterface);
