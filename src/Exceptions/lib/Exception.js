const UNKNOWN_FUNCTION = '?';

class Exception extends Error {
    /**
     * @type {string}
     */
    name;

    /**
     * @type {Exception}
     */
    previous;

    /**
     * @type {int}
     */
    code;

    /**
     * @type {string}
     *
     * @private
     */
    _message;

    /**
     * @type {Object.<string, string>[]}
     *
     * @private
     */
    _stackTrace;
    _originalStack;

    constructor(...args) {
        super();
        delete this.message;

        return this.__construct(...args);
    }

    /**
     * Constructor.
     *
     * @param {string} message
     * @param {int|null} [code = null]
     * @param {Exception} [previous]
     */
    __construct(message, code = null, previous = undefined) {
        this.name = this.constructor.name;
        this.previous = previous;
        this.code = code;
        this._message = message;

        if ('function' === typeof Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        this._originalStack = this.stack.split('\n').join('\n');
        this._updateStack();
    }

    /**
     * Get the parsed stack trace for this exception.
     *
     * @returns {Object.<string, string>[]}
     */
    get stackTrace() {
        if (undefined === this._stackTrace) {
            this._stackTrace = Exception.parseStackTrace(this);
        }

        return this._stackTrace;
    }

    /**
     * @returns {string}
     */
    get message() {
        return this._message;
    }

    /**
     * @param {string} message
     */
    set message(message) {
        this._message = message;
        this._updateStack();
    }

    /**
     * @private
     */
    _updateStack() {
        this._stackTrace = undefined;
        this.stack = this.constructor.name + ': ' + this.message + '\n\n' + this._originalStack;
    }

    /**
     * Parses a stack trace from an error instance.
     *
     * @param {Error} error
     *
     * @returns {Object.<string, string>[]}
     */
    static parseStackTrace(error) {
        const regex = /^\s*at (?:async )?(?:((?:\[object object])?\S+(?: \[as \S+])?) )?\(?(.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
            lines = error.stack.split('\n'),
            stack = [];
        let parts, element;

        for (let i = 0, j = lines.length; i < j; ++i) {
            regex.lastIndex = 0;
            if ((parts = regex.exec(lines[i]))) {
                element = {
                    file: parts[2],
                    'function': parts[1] || UNKNOWN_FUNCTION,
                    line: ~~parts[3],
                };
            } else {
                continue;
            }

            if ('Object.construct' === element.function && element.file.match(/(Namespace|ManagedProxy)\.js$/)) {
                continue;
            }

            stack.push(element);
        }

        if (! stack.length) {
            return null;
        }

        return stack;
    }
}

global.Exception = Exception;
