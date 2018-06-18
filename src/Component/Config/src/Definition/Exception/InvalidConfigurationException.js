const Exception = Jymfony.Component.Config.Definition.Exception.Exception;

/**
 * A very general exception which can be thrown whenever non of the more specific
 * exceptions is suitable.
 *
 * @memberOf Jymfony.Component.Config.Definition.Exception
 */
class InvalidConfigurationException extends Exception {
    /**
     * @param {string} path
     */
    setPath(path) {
        this._path = path;
    }

    /**
     * @returns {string}
     */
    getPath() {
        return this._path;
    }

    /**
     * Adds extra information that is suffixed to the original exception message.
     *
     * @param {string} hint
     */
    addHint(hint) {
        if (! this.containsHints) {
            this.message += '\nHint: ' + hint;
            this.containsHints = true;
        } else {
            this.message += ', ' + hint;
        }
    }
}

module.exports = InvalidConfigurationException;
