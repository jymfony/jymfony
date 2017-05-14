const util = require('util');
const Helper = Jymfony.Component.Console.Helper.Helper;

/**
 * Helps outputting debug information when running an external program from a command.
 * An external program can be a Process, an HTTP request, or anything else.
 *
 * @memberOf Jymfony.Component.Console.Helper
 */
class DebugFormatterHelper extends Helper {
    __construct() {
        super.__construct();

        this._colors = [ 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'default' ];
        this._started = {};
        this._count = -1;
    }

    /**
     * Starts a debug formatting session.
     *
     * @param {string} id The id of the formatting session
     * @param {string} message The message to display
     * @param {string} prefix The prefix to use
     *
     * @returns {string}
     */
    start(id, message, prefix = 'RUN') {
        this._started[id] = {border: ++this._count % this._colors.length};

        return util.format("%s<bg=blue;fg=white> %s </> <fg=blue>%s</>\n", this._getBorder(id), prefix, message);
    }

    /**
     * Adds progress to a formatting session.
     *
     * @param {string} id The id of the formatting session
     * @param {string} buffer The message to display
     * @param {boolean} error Whether to consider the buffer as error
     * @param {string} prefix The prefix for output
     * @param {string} errorPrefix The prefix for error output
     *
     * @returns {string}
     */
    progress(id, buffer, error = false, prefix = 'OUT', errorPrefix = 'ERR') {
        let message = '';

        if (error) {
            if (this._started[id] && this._started[id].out) {
                message += "\n";
                delete this._started[id].out;
            }

            if (! this._started[id] || ! this._started[id].err) {
                message += util.format('%s<bg=red;fg=white> %s </> ', this._getBorder(id), errorPrefix);
                this._started[id].err = true;
            }

            message += buffer.replace(/\n/g, util.format("\n%s<bg=red;fg=white> %s </> ", this._getBorder(id), errorPrefix));
        } else {
            if (this._started[id] && this._started[id].err) {
                message += "\n";
                delete this._started[id].err;
            }

            if (! this._started[id] || ! this._started[id].out) {
                message += util.format('%s<bg=green;fg=white> %s </> ', this._getBorder(id), prefix);
                this._started[id].out = true;
            }

            message += buffer.replace(/\n/g, util.format("\n%s<bg=green;fg=white> %s </> ", this._getBorder(id), prefix));
        }

        return message;
    }

    /**
     * Stops a formatting session.
     *
     * @param {string} id The id of the formatting session
     * @param {string} message The message to display
     * @param {boolean} successful Whether to consider the result as success
     * @param {string} prefix The prefix for the end output
     *
     * @returns {string}
     */
    stop(id, message, successful, prefix = 'RES') {
        let trailingEOL = this._started[id] && (this._started[id].out || this._started[id].err) ? "\n" : '';

        if (successful) {
            return util.format("%s%s<bg=green;fg=white> %s </> <fg=green>%s</>\n", trailingEOL, this._getBorder(id), prefix, message);
        }

        message = util.format("%s%s<bg=red;fg=white> %s </> <fg=red>%s</>\n", trailingEOL, this._getBorder(id), prefix, message);

        delete this._started[id].out;
        delete this._started[id].err;

        return message;
    }

    /**
     * @param {string} id The id of the formatting session
     *
     * @returns {string}
     */
    _getBorder(id) {
        return util.format('<bg=%s> </>', this._colors[this._started[id].border]);
    }
}

module.exports = DebugFormatterHelper;
