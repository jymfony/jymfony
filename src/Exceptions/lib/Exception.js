const UNKNOWN_FUNCTION = '?';

class Exception extends Error {
    constructor(message, code = null, previous = undefined) {
        super(message);

        this.name = this.constructor.name;
        this.previous = previous;
        this.code = code;
        this.message = message;
        if ('function' === typeof Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }

    /**
     * Get the parsed stack trace for this exception.
     *
     * @returns {[Object<string, string>]}
     */
    get stackTrace() {
        return Exception.parseStackTrace(this);
    }

    /**
     * Parses a stack trace from an error instance.
     *
     * @param {Error} error
     *
     * @returns {[Object<string, string>]}
     */
    static parseStackTrace(error) {
        const regex = /^\s*at (?:((?:\[object object])?\S+(?: \[as \S+])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;
        let lines = error.stack.split('\n'),
            stack = [],
            parts,
            element;

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
