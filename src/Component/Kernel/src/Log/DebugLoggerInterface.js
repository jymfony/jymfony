/**
 * @memberOf Jymfony.Component.Kernel.Log
 */
class DebugLoggerInterface {
    /**
     * Returns an array of logs.
     *
     * A log is an array with the following mandatory keys:
     * timestamp, message, priority, and priorityName.
     * It can also have an optional context key containing an array.
     *
     * @param {Jymfony.Component.Console.Command.Command|Jymfony.Component.HttpFoundation.Request} subject
     *
     * @returns {Array} An array of logs
     */
    getLogs(subject) { }

    /**
     * Returns the number of errors.
     *
     * @param {Jymfony.Component.Console.Command.Command|Jymfony.Component.HttpFoundation.Request} subject
     *
     * @returns {int} The number of errors
     */
    countErrors(subject) { }

    /**
     * Removes all log records.
     */
    clear() { }
}

module.exports = getInterface(DebugLoggerInterface);
