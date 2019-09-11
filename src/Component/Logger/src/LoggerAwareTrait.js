/**
 * Basic Implementation of LoggerAwareInterface.
 *
 * @memberOf Jymfony.Component.Logger
 */
class LoggerAwareTrait {
    /**
     * Sets a logger instance on the object.
     *
     * @param {Jymfony.Component.Logger.LoggerInterface} logger
     */
    setLogger(logger) {
        /**
         * @type {Jymfony.Component.Logger.LoggerInterface}
         *
         * @protected
         */
        this._logger = logger;
    }
}

export default getTrait(LoggerAwareTrait);
