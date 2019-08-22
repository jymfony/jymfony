const AbstractLogger = Jymfony.Component.Logger.AbstractLogger;

/**
 * @memberOf Jymfony.Component.Logger
 */
export default class NullLogger extends AbstractLogger {
    /**
     * This logger do nothing.
     */
    log() {
        // Do nothing.
    }
}
