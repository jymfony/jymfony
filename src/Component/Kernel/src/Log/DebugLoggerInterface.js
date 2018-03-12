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
     * @returns {Array} An array of logs
     */
    get logs() { }

    /**
     * Returns the number of errors.
     *
     * @returns {int} The number of errors
     */
    get countErrors() { }

    /**
     * Removes all log records.
     */
    clear() { }
}

module.exports = getInterface(DebugLoggerInterface);
