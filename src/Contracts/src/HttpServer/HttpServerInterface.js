/**
 * @memberOf Jymfony.Contracts.HttpServer
 */
class HttpServerInterface {
    /**
     * Listen and handle connections.
     *
     * @param {Object.<string, *>} opts
     */
    async listen(opts) { }

    /**
     * Closes the server.
     */
    async close() { }
}

export default getInterface(HttpServerInterface);
