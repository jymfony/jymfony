const LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
const LogLevel = Jymfony.Component.Logger.LogLevel;

/**
 * @memberOf Jymfony.Component.Logger
 */
module.exports = class AbstractLogger extends implementationOf(LoggerInterface) {
    /**
     * @inheritDoc
     */
    emergency(message, context = {}) {
        this.log(LogLevel.EMERGENCY, message, context);
    }

    /**
     * @inheritDoc
     */
    alert(message, context = {}) {
        this.log(LogLevel.ALERT, message, context);
    }

    /**
     * @inheritDoc
     */
    critical(message, context = {}) {
        this.log(LogLevel.CRITICAL, message, context);
    }

    /**
     * @inheritDoc
     */
    error(message, context = {}) {
        this.log(LogLevel.ERROR, message, context);
    }

    /**
     * @inheritDoc
     */
    warning(message, context = {}) {
        this.log(LogLevel.WARNING, message, context);
    }

    /**
     * @inheritDoc
     */
    notice(message, context = {}) {
        this.log(LogLevel.NOTICE, message, context);
    }

    /**
     * @inheritDoc
     */
    info(message, context = {}) {
        this.log(LogLevel.INFO, message, context);
    }

    /**
     * @inheritDoc
     */
    debug(message, context = {}) {
        this.log(LogLevel.DEBUG, message, context);
    }
};
