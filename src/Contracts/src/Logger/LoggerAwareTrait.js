/**
 * Basic Implementation of LoggerAwareInterface.
 *
 * @memberOf Jymfony.Contracts.Logger
 */
class LoggerAwareTrait {
    __construct() {
        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @protected
         */
        this._logger = null;
    }

    /**
     * Sets a logger instance on the object.
     *
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     */
    setLogger(logger) {
        this._logger = logger;
    }
}

export default getTrait(LoggerAwareTrait);
