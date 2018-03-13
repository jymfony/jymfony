const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 */
class CommandNotFoundException extends mix(BaseException, ExceptionInterface) {
    __construct(message, alternatives, previous = undefined) {
        super.__construct(message, previous);

        this._alternatives = alternatives;
    }

    get alternatives() {
        return this._alternatives;
    }
}

module.exports = CommandNotFoundException;
