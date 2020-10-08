/**
 * Describes a logger-aware instance.
 *
 * @memberOf Jymfony.Contracts.Logger
 */
class LoggerAwareInterface {
    /**
     * Sets a logger instance on the object.
     *
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     */
    setLogger(logger) { }
}

export default getInterface(LoggerAwareInterface);
