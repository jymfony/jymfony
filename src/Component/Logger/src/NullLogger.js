const AbstractLogger = Jymfony.Component.Logger.AbstractLogger;

/**
 * @memberOf Jymfony.Component.Logger
 */
class NullLogger extends AbstractLogger {
    /**
     * This logger do nothing.
     */
    log() {
        // Do nothing.
    }
}

module.exports = NullLogger;
