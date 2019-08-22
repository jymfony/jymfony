/**
 * Describes a logger-aware instance.
 *
 * @memberOf Jymfony.Component.Logger
 */
class LoggerAwareInterface {
    /**
     * Sets a logger instance on the object.
     *
     * @param {Jymfony.Component.Logger.LoggerInterface} logger
     */
    setLogger(logger) { }
}

export default getInterface(LoggerAwareInterface);
