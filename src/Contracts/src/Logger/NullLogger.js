const LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;

/**
 * @memberOf Jymfony.Contracts.Logger
 */
export default class NullLogger extends implementationOf(LoggerInterface) {
    /**
     * @inheritdoc
     */
    emergency(message, context = {}) {
        // Do nothing
    }

    /**
     * @inheritdoc
     */
    alert(message, context = {}) {
        // Do nothing
    }

    /**
     * @inheritdoc
     */
    critical(message, context = {}) {
        // Do nothing
    }

    /**
     * @inheritdoc
     */
    error(message, context = {}) {
        // Do nothing
    }

    /**
     * @inheritdoc
     */
    warning(message, context = {}) {
        // Do nothing
    }

    /**
     * @inheritdoc
     */
    notice(message, context = {}) {
        // Do nothing
    }

    /**
     * @inheritdoc
     */
    info(message, context = {}) {
        // Do nothing
    }

    /**
     * @inheritdoc
     */
    debug(message, context = {}) {
        // Do nothing
    }

    /**
     * @inheritdoc
     */
    log(level, message, context = {}) {
        // Do nothing
    }
}
