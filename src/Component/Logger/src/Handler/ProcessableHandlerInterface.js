/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class ProcessableHandlerInterface {
    /**
     * Adds a processor in the stack.
     *
     * @param {Function} processor
     *
     * @returns {Jymfony.Component.Logger.Handler.HandlerInterface}
     */
    pushProcessor(processor) { }

    /**
     * Removes the processor on top of the stack and returns it.
     *
     * @throws {Jymfony.Contracts.Logger.Exception.LogicException} In case the processor stack is empty
     *
     * @returns {Function}
     */
    popProcessor() { }
}

export default getInterface(ProcessableHandlerInterface);
