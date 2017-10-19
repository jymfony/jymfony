const AbstractLogger = Jymfony.Component.Logger.AbstractLogger;

/**
 * @memberOf Jymfony.Component.Logger
 */
class NullLogger extends AbstractLogger {
    log(level, message, context) {
        // Do nothing.
    }
}

module.exports = NullLogger;
