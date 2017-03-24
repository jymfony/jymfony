/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class HandlerInterface {
    /**
     * Checks whether the given record will be handled by this handler.
     *
     * This is mostly done for performance reasons, to avoid calling processors for nothing.
     *
     * Handlers should still check the record levels within handle(), returning false in isHandling()
     * is no guarantee that handle() will not be called, and isHandling() might not be called
     * for a given record.
     *
     * @param {Object.<*>} record Partial log record containing only a level key
     *
     * @returns {boolean}
     */
    isHandling(record) { }

    /**
     * Handles a record.
     *
     * All records may be passed to this method, and the handler should discard
     * those that it does not want to handle.
     *
     * The return value of this function controls the bubbling process of the handler stack.
     * Unless the bubbling is interrupted (by returning true), the Logger class will keep on
     * calling further handlers in the stack with a given log record.
     *
     * @param {Object.<*>} record The record to handle
     *
     * @returns {boolean} true means that this handler handled the record, and that bubbling is not permitted.
     *                    false means the record was either not processed or that this handler allows bubbling.
     */
    handle(record) { }

    /**
     * Handles a set of records at once.
     *
     * @param {Object.<*>[]} records The records to handle (an array of record arrays)
     */
    handleBatch(records) { }

    /**
     * Closes the handler.
     *
     * Implementations have to be idempotent (i.e. it should be possible to call close several times without breakage)
     * and ideally handlers should be able to reopen themselves on handle() after they have been closed.
     */
    close() { }
}

module.exports = getInterface(HandlerInterface);
