const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const OutputFormatterStyleInterface = Jymfony.Component.Console.Formatter.OutputFormatterStyleInterface;

const util = require("util");

const availableForegroundColors = {
    'black': {'set': 30, 'unset': 39},
    'red': {'set': 31, 'unset': 39},
    'green': {'set': 32, 'unset': 39},
    'yellow': {'set': 33, 'unset': 39},
    'blue': {'set': 34, 'unset': 39},
    'magenta': {'set': 35, 'unset': 39},
    'cyan': {'set': 36, 'unset': 39},
    'white': {'set': 37, 'unset': 39},
    'default': {'set': 39, 'unset': 39},
};

const availableBackgroundColors = {
    'black': {'set': 40, 'unset': 49},
    'red': {'set': 41, 'unset': 49},
    'green': {'set': 42, 'unset': 49},
    'yellow': {'set': 43, 'unset': 49},
    'blue': {'set': 44, 'unset': 49},
    'magenta': {'set': 45, 'unset': 49},
    'cyan': {'set': 46, 'unset': 49},
    'white': {'set': 47, 'unset': 49},
    'default': {'set': 49, 'unset': 49},
};

const availableOptions = {
    'bold': {'set': 1, 'unset': 22},
    'underscore': {'set': 4, 'unset': 24},
    'blink': {'set': 5, 'unset': 25},
    'reverse': {'set': 7, 'unset': 27},
    'conceal': {'set': 8, 'unset': 28},
};

/**
 * @memberOf Jymfony.Component.Console.Formatter
 */
class OutputFormatterStyle extends implementationOf(OutputFormatterStyleInterface) {
    __construct(foreground = null, background = null, options = []) {
        if (foreground) {
            this.foreground = foreground;
        }

        if (background) {
            this.background = background;
        }

        if (options.length) {
            this.setOptions(options);
        }

        this._options = new Set;
    }

    /**
     * @inheritDoc
     */
    set foreground(color) {
        if (! color) {
            this._foreground = undefined;
            return;
        }

        if (! availableForegroundColors[color]) {
            throw new InvalidArgumentException(
                `Invalid foreground color specified: "${color}". Expected one of (${Object.keys(availableForegroundColors).join(', ')})`
            );
        }

        this._foreground = availableForegroundColors[color];
    }

    /**
     * @inheritDoc
     */
    set background(color) {
        if (! color) {
            this._background = undefined;
            return;
        }

        if (! availableBackgroundColors[color]) {
            throw new InvalidArgumentException(
                `Invalid foreground color specified: "${color}". Expected one of (${Object.keys(availableBackgroundColors).join(', ')})`
            );
        }

        this._background = availableBackgroundColors[color];
    }

    /**
     * @inheritDoc
     */
    setOption(option) {
        if (! availableOptions[option]) {
            throw new InvalidArgumentException(
                `Invalid option specified: "${option}". Expected one of (${Object.keys(availableOptions).join(', ')})`
            );
        }

        this._options.add(availableOptions[option]);
    }

    /**
     * @inheritDoc
     */
    unsetOption(option) {
        if (! availableOptions[option]) {
            throw new InvalidArgumentException(
                `Invalid option specified: "${option}". Expected one of (${Object.keys(availableOptions).join(', ')})`
            );
        }

        this._options.delete(availableOptions[option]);
    }

    /**
     * @inheritDoc
     */
    setOptions(options) {
        this._options.clear();

        for (let opt of options) {
            this.setOption(opt);
        }
    }

    /**
     * @inheritDoc
     */
    apply(text) {
        let setCodes = [];
        let unsetCodes = [];

        if (this._foreground) {
            setCodes.push(this._foreground['set']);
            unsetCodes.push(this._foreground['unset']);
        }

        if (this._background) {
            setCodes.push(this._background['set']);
            unsetCodes.push(this._background['unset']);
        }

        if (this._options.length) {
            for (let opt of this._options) {
                setCodes.push(opt['set']);
                unsetCodes.push(opt['unset']);
            }
        }

        if (0 === setCodes.length) {
            return text;
        }

        return util.format("\x1B[%sm%s\x1B[%sm", setCodes.join(';'), text, unsetCodes.join(';'));
    }
}

module.exports = OutputFormatterStyle;
