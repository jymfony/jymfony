const BaseException = global.InvalidArgumentException;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;

/**
 * @memberOf Jymfony.Component.Console.Exception
 */
export default class CommandNotFoundException extends mix(BaseException, ExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {string[]} alternatives
     * @param {Exception} [previous]
     */
    __construct(message, alternatives, previous = undefined) {
        super.__construct(message, null, previous);

        this._alternatives = alternatives;
    }

    /**
     * @returns {string[]}
     */
    get alternatives() {
        return this._alternatives;
    }
}
