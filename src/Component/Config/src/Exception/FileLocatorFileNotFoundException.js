/**
 * File locator exception if a file does not exist.
 *
 * @memberOf Jymfony.Component.Config.Exception
 */
class FileLocatorFileNotFoundException extends InvalidArgumentException {
    constructor(message = '', code = null, previous = undefined, paths = []) {
        super(message, code, previous);

        /**
         * @type {[string]}
         * @private
         */
        this._paths = paths;
    }

    get paths() {
        return this._paths;
    }
}

module.exports = FileLocatorFileNotFoundException;
