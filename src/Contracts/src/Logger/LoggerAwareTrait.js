/**
 * Basic Implementation of LoggerAwareInterface.
 *
 * @memberOf Jymfony.Contracts.Logger
 */
class LoggerAwareTrait {
    /**
     * Sets a logger instance on the object.
     *
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     */
    setLogger(logger) {
        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @protected
         */
        this._logger = logger;
    }
}

export default getTrait(LoggerAwareTrait);
