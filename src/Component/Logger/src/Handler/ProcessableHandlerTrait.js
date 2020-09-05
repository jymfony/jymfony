const LogicException = Jymfony.Component.Logger.Exception.LogicException;

/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class ProcessableHandlerTrait {
    /**
     * Constructor.
     */
    __construct() {
        this._processors = [];
    }

    /**
     * Push a processor at the top of the stack.
     *
     * @param {Function} processor
     *
     * @returns {Jymfony.Component.Logger.Handler.ProcessableHandlerTrait}
     */
    pushProcessor(processor) {
        this._processors.unshift(processor);

        return this;
    }

    /**
     * Pop the first processor of the stack.
     *
     * @returns {Function}
     */
    popProcessor() {
        if (0 === this._processors.length) {
            throw new LogicException('Trying to pop out a processor off an empty stack');
        }

        return this._processors.shift();
    }


    /**
     * Processes a record.
     *
     * @param {*} record
     *
     * @returns {*}
     *
     * @protected
     */
    _processRecord(record) {
        for (const processor of this._processors) {
            record = processor(record);
        }

        return record;
    }
}

export default getTrait(ProcessableHandlerTrait);
