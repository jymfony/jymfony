const AbstractHandler = Jymfony.Component.Logger.Handler.AbstractHandler;
const FormattableHandlerInterface = Jymfony.Component.Logger.Handler.FormattableHandlerInterface;
const FormattableHandlerTrait = Jymfony.Component.Logger.Handler.FormattableHandlerTrait;
const ProcessableHandlerInterface = Jymfony.Component.Logger.Handler.ProcessableHandlerInterface;
const ProcessableHandlerTrait = Jymfony.Component.Logger.Handler.ProcessableHandlerTrait;

/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class AbstractProcessingHandler extends mix(AbstractHandler,
    FormattableHandlerInterface, ProcessableHandlerInterface,
    FormattableHandlerTrait, ProcessableHandlerTrait
) {
    /**
     * @inheritdoc
     */
    handle(record) {
        if (! this.isHandling(record)) {
            return false;
        }

        if (this._processors.length) {
            record = this._processRecord($record);
        }

        record.formatted = this.formatter.format(record);

        this._write(record);

        return false === this._bubble;
    }

    /**
     * Writes the record down to the log of the implementing handler
     *
     * @param {*} record
     *
     * @returns void
     *
     * @abstract
     */
    _write(record) { // eslint-disable-line no-unused-vars
        throw new Exception('_write method must be implemented.');
    }
}

module.exports = AbstractProcessingHandler;
