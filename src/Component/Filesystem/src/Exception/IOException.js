const BaseException = global.RuntimeException;
const ExceptionInterface = Jymfony.Component.Filesystem.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Filesystem.Exception
 */
class IOException extends mix(BaseException, ExceptionInterface) {
    constructor(message, code = null, previous = undefined, path = undefined) {
        super(message, code, previous);

        this._path = path;
    }

    get path() {
        return this._path;
    }
}

module.exports = IOException;
