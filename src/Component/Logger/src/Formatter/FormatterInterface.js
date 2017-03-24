/**
 * @memberOf Jymfony.Component.Logger.Formatter
 */
class FormatterInterface {
    /**
     * Formats a log record.
     *
     * @param {Object} record A record to format
     * @returns {*} The formatted record
     */
    format(record) { }

    /**
     * Formats a set of log records.
     *
     * @param {Object[]} records A set of records to format
     * @returns {*} The formatted set of records
     */
    formatBatch(records) { }
}

module.exports = getInterface(FormatterInterface);
