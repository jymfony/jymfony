const util = require('util');
const Helper = Jymfony.Component.Console.Helper.Helper;
const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;

/**
 * @memberOf Jymfony.Component.Console.Helper
 */
class FormatterHelper extends Helper {
    /**
     * Formats a message within a section.
     *
     * @param {string} section The section name
     * @param {string} message The message
     * @param {string} style The style to apply to the section
     *
     * @returns {string} The format section
     */
    formatSection(section, message, style = 'info') {
        return util.format('<%s>[%s]</%s> %s', style, section, style, message);
    }

    /**
     * Formats a message as a block of text.
     *
     * @param {string|string[]} messages The message to write in the block
     * @param {string} style The style to apply to the whole block
     * @param {boolean} large Whether to return a large block
     *
     * @returns {string} The formatter message
     */
    formatBlock(messages, style, large = false) {
        if (! isArray(messages)) {
            messages = [ messages ];
        }

        let len = 0;
        const lines = [];

        for (let message of messages) {
            message = OutputFormatter.escape(message);
            lines.push(util.format(large ? '  %s  ' : ' %s ', message));
            len = Math.max(message.length + (large ? 4 : 2), len);
        }

        messages = large ? [ ' '.repeat(len) ] : [];
        for (let i = 0; i < lines.length; ++i) {
            messages.push(lines[i] + ' '.repeat(len - lines[i].length));
        }

        if (large) {
            messages.push(' '.repeat(len));
        }

        for (let i = 0; i < messages.length; ++i) {
            messages[i] = util.format('<%s>%s</%s>', style, messages[i], style);
        }

        return messages.join('\n');
    }

    /**
     * Truncates a message to the given length.
     *
     * @param {string} message
     * @param {int} length
     * @param {string} suffix
     *
     * @returns {string}
     */
    truncate(message, length, suffix = '...') {
        const computedLength = length - suffix.length;

        if (computedLength > message.length) {
            return message;
        }

        return message.substr(0, length) + suffix;
    }
}

module.exports = FormatterHelper;
