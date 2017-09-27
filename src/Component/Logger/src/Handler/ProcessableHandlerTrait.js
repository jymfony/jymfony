const LogicException = Jymfony.Component.Logger.Exception.LogicException;

/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class ProcessableHandlerTrait {
    __construct() {
        this._processors = [];
    }

    pushProcessor(processor) {
        this._processors.unshift(processor);

        return this;
    }

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

module.exports = getTrait(ProcessableHandlerTrait);
