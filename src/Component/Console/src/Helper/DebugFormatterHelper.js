const Helper = Jymfony.Component.Console.Helper.Helper;

/**
 * Helps outputting debug information when running an external program from a command.
 * An external program can be a Process, an HTTP request, or anything else.
 *
 * @memberOf Jymfony.Component.Console.Helper
 */
class DebugFormatterHelper extends Helper {
    /**
     * Constructor.
     */
    __construct() {
        super.__construct();

        /**
         * @type {string[]}
         *
         * @private
         */
        this._colors = [ 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'default' ];

        /**
         * @type {Object}
         *
         * @private
         */
        this._started = {};

        /**
         * @type {int}
         *
         * @private
         */
        this._count = -1;
    }

    /**
     * Starts a debug formatting session.
     *
     * @param {string} id The id of the formatting session
     * @param {string} message The message to display
     * @param {string} [prefix = 'RUN'] The prefix to use
     *
     * @returns {string}
     */
    start(id, message, prefix = 'RUN') {
        this._started[id] = {border: ++this._count % this._colors.length};

        return __jymfony.sprintf('%s<bg=blue;fg=white> %s </> <fg=blue>%s</>\n', this._getBorder(id), prefix, message);
    }

    /**
     * Adds progress to a formatting session.
     *
     * @param {string} id The id of the formatting session
     * @param {string} buffer The message to display
     * @param {boolean} [error = false] Whether to consider the buffer as error
     * @param {string} [prefix = 'OUT'] The prefix for output
     * @param {string} [errorPrefix = 'ERR'] The prefix for error output
     *
     * @returns {string}
     */
    progress(id, buffer, error = false, prefix = 'OUT', errorPrefix = 'ERR') {
        let message = '';

        if (error) {
            if (this._started[id] && this._started[id].out) {
                message += '\n';
                delete this._started[id].out;
            }

            if (! this._started[id] || ! this._started[id].err) {
                message += __jymfony.sprintf('%s<bg=red;fg=white> %s </> ', this._getBorder(id), errorPrefix);
                this._started[id].err = true;
            }

            message += buffer.replace(/\n/g, __jymfony.sprintf('\n%s<bg=red;fg=white> %s </> ', this._getBorder(id), errorPrefix));
        } else {
            if (this._started[id] && this._started[id].err) {
                message += '\n';
                delete this._started[id].err;
            }

            if (! this._started[id] || ! this._started[id].out) {
                message += __jymfony.sprintf('%s<bg=green;fg=white> %s </> ', this._getBorder(id), prefix);
                this._started[id].out = true;
            }

            message += buffer.replace(/\n/g, __jymfony.sprintf('\n%s<bg=green;fg=white> %s </> ', this._getBorder(id), prefix));
        }

        return message;
    }

    /**
     * Stops a formatting session.
     *
     * @param {string} id The id of the formatting session
     * @param {string} message The message to display
     * @param {boolean} successful Whether to consider the result as success
     * @param {string} [prefix = 'RES'] The prefix for the end output
     *
     * @returns {string}
     */
    stop(id, message, successful, prefix = 'RES') {
        const trailingEOL = this._started[id] && (this._started[id].out || this._started[id].err) ? '\n' : '';

        if (successful) {
            return __jymfony.sprintf('%s%s<bg=green;fg=white> %s </> <fg=green>%s</>\n', trailingEOL, this._getBorder(id), prefix, message);
        }

        message = __jymfony.sprintf('%s%s<bg=red;fg=white> %s </> <fg=red>%s</>\n', trailingEOL, this._getBorder(id), prefix, message);

        delete this._started[id].out;
        delete this._started[id].err;

        return message;
    }

    /**
     * @param {string} id The id of the formatting session
     *
     * @returns {string}
     *
     * @private
     */
    _getBorder(id) {
        return __jymfony.sprintf('<bg=%s> </>', this._colors[this._started[id].border]);
    }
}

module.exports = DebugFormatterHelper;
