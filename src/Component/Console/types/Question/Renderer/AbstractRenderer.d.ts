declare namespace Jymfony.Component.Console.Question.Renderer {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import Question = Jymfony.Component.Console.Question.Question;
    import OutputFormatterInterface = Jymfony.Component.Console.Formatter.OutputFormatterInterface;

    /**
     * Abstract question renderer.
     *
     * @internal
     */
    export abstract class AbstractRenderer extends implementationOf(RendererInterface) {
        /**
         * The underlying question object.
         */
        protected _question: Question;

        /**
         * Input object.
         */
        protected _input: NodeJS.ReadableStream;

        /**
         * Output object.
         */
        protected _output: OutputInterface;

        /**
         * Output formatter.
         */
        protected _outputFormatter: OutputFormatterInterface;

        /**
         * Constructor.
         */
        __construct(question: Question): void;
        constructor(question: Question);
    }
}
