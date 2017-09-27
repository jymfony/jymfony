const OutputFormatterStyle = Jymfony.Component.Console.Formatter.OutputFormatterStyle;

/**
 * @memberOf Jymfony.Component.Console.Formatter
 */
class OutputFormatterStyleStack {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Formatter.OutputFormatterStyleInterface|null} emptyStyle
     */
    __construct(emptyStyle = undefined) {
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
     * @param {Jymfony.Component.Console.Formatter.OutputFormatterStyleInterface} style
     */
    push(style) {
        this._styles.push(style);
    }

    /**
     * Pops a style from the stack.
     *
     * @param {Jymfony.Component.Console.Formatter.OutputFormatterStyleInterface|undefined} style
     *
     * @returns {Jymfony.Component.Console.Formatter.OutputFormatterStyleInterface}
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

        const styles = [ ...this._styles ];
        styles.reverse();

        for (const [ index, stackedStyle ] of __jymfony.getEntries(styles)) {
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
     * @returns {Jymfony.Component.Console.Formatter.OutputFormatterStyleInterface}
     */
    get current() {
        if (! this._styles.length) {
            return this._emptyStyle;
        }

        return this._styles[this._styles.length - 1];
    }

    /**
     * @param {Jymfony.Component.Console.Formatter.OutputFormatterStyleInterface} emptyStyle
     */
    set emptyStyle(emptyStyle) {
        this._emptyStyle = emptyStyle;
    }

    /**
     * @returns {Jymfony.Component.Console.Formatter.OutputFormatterStyleInterface}
     */
    get emptyStyle() {
        return this._emptyStyle;
    }
}

module.exports = OutputFormatterStyleStack;
