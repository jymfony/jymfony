const RendererInterface = Jymfony.Component.Console.Question.Renderer.RendererInterface;
const StreamableInputInterface = Jymfony.Component.Console.Input.StreamableInputInterface;

/**
 * Abstract question renderer.
 *
 * @memberOf Jymfony.Component.Console.Question.Renderer
 *
 * @abstract
 *
 * @internal
 */
class AbstractRenderer extends implementationOf(RendererInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Question.Question} question
     */
    __construct(question) {
        /**
         * The underlying question object.
         *
         * @type {Jymfony.Component.Console.Question.Question}
         *
         * @protected
         */
        this._question = question;

        /**
         * Input object.
         *
         * @type {NodeJS.ReadableStream}
         *
         * @protected
         */
        this._input = (this._question._input instanceof StreamableInputInterface ? this._question._input.stream : undefined) || process.stdin;

        /**
         * Output object.
         *
         * @type {Jymfony.Component.Console.Output.OutputInterface}
         *
         * @protected
         */
        this._output = this._question._output;

        /**
         * Output formatter.
         *
         * @type {Jymfony.Component.Console.Formatter.OutputFormatterInterface}
         *
         * @protected
         */
        this._outputFormatter = this._output.formatter;
    }
}

module.exports = AbstractRenderer;
