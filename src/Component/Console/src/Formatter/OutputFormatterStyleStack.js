const OutputFormatterStyle = Jymfony.Console.Formatter.OutputFormatterStyle;

/**
 * @memberOf Jymfony.Console.Formatter
 * @type OutputFormatterStyleStack
 */
module.exports = class OutputFormatterStyleStack {
    /**
     * Constructor.
     *
     * @param {Jymfony.Console.Formatter.OutputFormatterStyleInterface|null} emptyStyle
     */
    constructor(emptyStyle = undefined) {
        this._emptyStyle = emptyStyle || new OutputFormatterStyle();
        this.reset();
    }

    /**
     * Resets stack (ie. empty internal arrays).
     */
    reset() {
        this._styles = [];
    }

    /**
     * Pushes a style in the stack.
     *
     * @param {Jymfony.Console.Formatter.OutputFormatterStyleInterface} style
     */
    push(style) {
        this._styles.push(style);
    }

    /**
     * Pops a style from the stack.
     *
     * @param {Jymfony.Console.Formatter.OutputFormatterStyleInterface|undefined} style
     *
     * @returns {Jymfony.Console.Formatter.OutputFormatterStyleInterface}
     *
     * @throws {InvalidArgumentException} When style tags incorrectly nested
     */
    pop(style) {
        if (! this._styles.length) {
            return this._emptyStyle;
        }

        if (! style) {
            return this._styles.pop();
        }

        let styles = [ ...this._styles ];
        styles.reverse();

        for (let [ index, stackedStyle ] of __jymfony.getEntries(styles)) {
            if (style.apply('') === stackedStyle.apply('')) {
                this._styles = this._styles.slice(0, index);

                return stackedStyle;
            }
        }

        throw new InvalidArgumentException('Incorrectly nested style tag found.');
    }

    /**
     * Computes current style with stacks top codes.
     *
     * @returns {Jymfony.Console.Formatter.OutputFormatterStyleInterface}
     */
    get current() {
        if (! this._styles.length) {
            return this._emptyStyle;
        }

        return this._styles[this._styles.length - 1];
    }

    /**
     * @param {Jymfony.Console.Formatter.OutputFormatterStyleInterface} emptyStyle
     */
    set emptyStyle(emptyStyle) {
        this._emptyStyle = emptyStyle;
    }

    /**
     * @returns {Jymfony.Console.Formatter.OutputFormatterStyleInterface}
     */
    get emptyStyle() {
        return this._emptyStyle;
    }
};
