const UNKNOWN_FUNCTION = '?';

class Exception extends Error {
    constructor(...$args) {
        super();
        delete this.message;

        return this.__construct(...$args);
    }

    __construct(message, code = null, previous = undefined) {
        /**
         * @type {string}
         */
        this.name = this.constructor.name;

        /**
         * @type {Exception}
         */
        this.previous = previous;

        /**
         * @type {int}
         */
        this.code = code;

        /**
         * @type {string}
         */
        this._message = message;

        Error.captureStackTrace(this, this.constructor);
        this._originalStack = this.stack.split('\n').join('\n');

        this._updateStack();
    }

    /**
     * Get the parsed stack trace for this exception.
     *
     * @returns {[Object<string, string>]}
     */
    get stackTrace() {
        return Exception.parseStackTrace(this);
    }

    set message(message) {
        this._message = message;
        this._updateStack();
    }

    get message() {
        return this._message;
    }

    _updateStack() {
        this.stack = this.constructor.name + ': ' + this.message + '\n\n' + this._originalStack;
    }

    /**
     * Parses a stack trace from an error instance.
     *
     * @param {Error} error
     *
     * @returns {[Object<string, string>]}
     */
    static parseStackTrace(error) {
        const regex = /^\s*at (?:((?:\[object object])?\S+(?: \[as \S+])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i,
            lines = error.stack.split('\n'),
            stack = [];
        let parts, element;

        for (let i = 0, j = lines.length; i < j; ++i) {
            if ((parts = regex.exec(lines[i]))) {
                element = {
                    file: parts[2],
                    'function': parts[1] || UNKNOWN_FUNCTION,
                    line: ~~parts[3],
                };
            } else {
                continue;
            }

            stack.push(element);
        }

        if (!stack.length) {
            return null;
        }

        return stack;
    }
}

global.Exception = Exception;
