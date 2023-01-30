/**
 * @memberOf Jymfony.Component.Messenger.Middleware
 */
class MiddlewareInterface {
    /**
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {Jymfony.Component.Messenger.Middleware.StackInterface} stack
     *
     * @returns {Promise<Jymfony.Component.Messenger.Envelope>}
     */
    async handle(envelope, stack) { }
}

export default getInterface(MiddlewareInterface);
