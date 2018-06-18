const BaseException = global.RuntimeException;
const ExceptionInterface = Jymfony.Component.Filesystem.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Filesystem.Exception
 */
class IOException extends mix(BaseException, ExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {null|int} [code = null]
     * @param {string} [previous]
     * @param {string} [path]
     */
    __construct(message, code = null, previous = undefined, path = undefined) {
        super.__construct(message, code, previous);

        /**
         * @type {string|undefined}
         *
         * @private
         */
        this._path = path;
    }

    /**
     * @returns {string|undefined}
     */
    get path() {
        return this._path;
    }
}

module.exports = IOException;
