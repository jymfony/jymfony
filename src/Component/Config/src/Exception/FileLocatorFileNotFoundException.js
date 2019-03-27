/**
 * File locator exception if a file does not exist.
 *
 * @memberOf Jymfony.Component.Config.Exception
 */
class FileLocatorFileNotFoundException extends InvalidArgumentException {
    /**
     * Constructor.
     *
     * @param {string} [message = '']
     * @param {null|int} [code = null]
     * @param {Exception} [previous]
     * @param {string[]} [paths = []]
     */
    __construct(message = '', code = null, previous = undefined, paths = []) {
        super.__construct(message, code, previous);

        /**
         * @type {string[]}
         *
         * @private
         */
        this._paths = paths;
    }

    /**
     * @returns {string[]}
     */
    get paths() {
        return this._paths;
    }
}

module.exports = FileLocatorFileNotFoundException;
