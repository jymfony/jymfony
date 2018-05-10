/**
 * Describes a logger instance.
 *
 * The message MUST be a string or object implementing toString().
 *
 * The message MAY contain placeholders in the form: {foo} where foo
 * will be replaced by the context data in key "foo".
 *
 * The context object can contain arbitrary data. The only assumption that
 * can be made by implementors is that if an Error instance is given
 * to produce a stack trace, it MUST be in a key named "error".
 *
 * @memberOf Jymfony.Component.Logger
 */
class LoggerInterface {
    /**
     * System is unusable.
     *
     * @param {string} message
     * @param {object} [context = {}]
     *
     * @returns {void}
     */
    emergency(message, context = {}) { }

    /**
     * Action must be taken immediately.
     *
     * Example: Entire website down, database unavailable, etc. This should
     * trigger the SMS alerts and wake you up.
     *
     * @param {string} message
     * @param {object} [context = {}]
     *
     * @returns {void}
     */
    alert(message, context = {}) { }

    /**
     * Critical conditions.
     *
     * Example: Application component unavailable, unexpected exception.
     *
     * @param {string} message
     * @param {object} [context = {}]
     *
     * @returns {void}
     */
    critical(message, context = {}) { }

    /**
     * Runtime errors that do not require immediate action but should typically
     * be logged and monitored.
     *
     * @param {string} message
     * @param {object} [context = {}]
     *
     * @returns {void}
     */
    error(message, context = {}) { }

    /**
     * Exceptional occurrences that are not errors.
     *
     * Example: Use of deprecated APIs, poor use of an API, undesirable things
     * that are not necessarily wrong.
     *
     * @param {string} message
     * @param {object} [context = {}]
     *
     * @returns {void}
     */
    warning(message, context = {}) { }

    /**
     * Normal but significant events.
     *
     * @param {string} message
     * @param {object} [context = {}]
     *
     * @returns {void}
     */
    notice(message, context = {}) { }

    /**
     * Interesting events.
     *
     * Example: User logs in, SQL logs.
     *
     * @param {string} message
     * @param {object} [context = {}]
     *
     * @returns {void}
     */
    info(message, context = {}) { }

    /**
     * Detailed debug information.
     *
     * @param {string} message
     * @param {object} [context = {}]
     *
     * @returns {void}
     */
    debug(message, context = {}) { }

    /**
     * Logs with an arbitrary level.
     *
     * @param {int} level
     * @param {string} message
     * @param {object} [context = {}]
     *
     * @returns {void}
     */
    log(level, message, context = {}) { }
}

module.exports = getInterface(LoggerInterface);
