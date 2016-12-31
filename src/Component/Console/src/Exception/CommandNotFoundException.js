const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Console.Exception
 * @type CommandNotFoundException
 */
module.exports = class CommandNotFoundException extends mix(BaseException, ExceptionInterface) {
    constructor(message, alternatives, previous = undefined) {
        super(message, previous);

        this._alternatives = alternatives;
    }

    get alternatives() {
        return this._alternatives;
    }
};
