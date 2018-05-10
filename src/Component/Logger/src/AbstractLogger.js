const LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
const LogLevel = Jymfony.Component.Logger.LogLevel;

/**
 * @memberOf Jymfony.Component.Logger
 */
class AbstractLogger extends implementationOf(LoggerInterface) {
    /**
     * @inheritdoc
     */
    emergency(message, context = {}) {
        this.log(LogLevel.EMERGENCY, message, context);
    }

    /**
     * @inheritdoc
     */
    alert(message, context = {}) {
        this.log(LogLevel.ALERT, message, context);
    }

    /**
     * @inheritdoc
     */
    critical(message, context = {}) {
        this.log(LogLevel.CRITICAL, message, context);
    }

    /**
     * @inheritdoc
     */
    error(message, context = {}) {
        this.log(LogLevel.ERROR, message, context);
    }

    /**
     * @inheritdoc
     */
    warning(message, context = {}) {
        this.log(LogLevel.WARNING, message, context);
    }

    /**
     * @inheritdoc
     */
    notice(message, context = {}) {
        this.log(LogLevel.NOTICE, message, context);
    }

    /**
     * @inheritdoc
     */
    info(message, context = {}) {
        this.log(LogLevel.INFO, message, context);
    }

    /**
     * @inheritdoc
     */
    debug(message, context = {}) {
        this.log(LogLevel.DEBUG, message, context);
    }
}

module.exports = AbstractLogger;
