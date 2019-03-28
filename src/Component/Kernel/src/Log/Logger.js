const BaseLogger = Jymfony.Component.Logger.Logger;
const DebugLoggerInterface = Jymfony.Component.Kernel.Log.DebugLoggerInterface;

/**
 * @memberOf Jymfony.Component.Kernel.Log
 */
class Logger extends mix(BaseLogger, DebugLoggerInterface) {
    /**
     * @inheritdoc
     */
    getLogs(subject) {
        const logger = this._getDebugLogger();
        if (logger) {
            return logger.getLogs(subject);
        }

        return [];
    }

    /**
     * @inheritdoc
     */
    countErrors(subject) {
        const logger = this._getDebugLogger();
        if (logger) {
            return logger.countErrors(subject);
        }

        return 0;
    }

    /**
     * @inheritdoc
     */
    clear() {
        const logger = this._getDebugLogger();
        if (logger) {
            logger.clear();
        }
    }

    /**
     * Returns a DebugLoggerInterface instance if one is registered with this logger.
     *
     * @returns {Jymfony.Component.Kernel.Log.DebugLoggerInterface}
     *
     * @private
     */
    _getDebugLogger() {
        for (const processor of this._processors) {
            if (processor instanceof DebugLoggerInterface) {
                return processor;
            }
        }

        for (const handler of this._handlers) {
            if (handler instanceof DebugLoggerInterface) {
                return handler;
            }
        }

        return null;
    }
}

module.exports = Logger;
