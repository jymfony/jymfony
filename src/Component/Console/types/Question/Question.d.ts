declare namespace Jymfony.Component.Console.Question {
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import RendererInterface = Jymfony.Component.Console.Question.Renderer.RendererInterface;

    /**
     * Represents a console question
     * It is strongly recommended to create a question with the help of a
     * QuestionBuilder object
     */
    export class Question {
        /**
         * The question to be prompted.
         */
        public /* writeonly */ question: string;

        /**
         * Sets the default answer.
         */
        public /* writeonly */ defaultAnswer: any;

        /**
         * Sets the normalizer.
         */
        public /* writeonly */ normalizer: Invokable<any>;

        /**
         * Sets the validator.
         */
        public /* writeonly */ validator: Invokable<void>;

        /**
         * Sets the autocomplete values.
         */
        public /* writeonly */ autocompleteValues: string[];

        /**
         * Input instance.
         */
        protected _input: InputInterface;

        /**
         * Output instance.
         */
        protected _output: OutputInterface;

        /**
         * The question to be prompted to the user.
         */
        protected _question: string;

        /**
         * The default answer to be returned if the user enters nothing.
         */
        protected _default: any;

        /**
         * The answer normalizer.
         */
        protected _normalizer: Invokable<any>;

        /**
         * Answer validator.
         */
        protected _validator: Invokable<void>;

        /**
         * Constructor.
         *
         * @param {Jymfony.Component.Console.Input.InputInterface} input
         * @param {Jymfony.Component.Console.Output.OutputInterface} output
         */
        __construct(input: InputInterface, output: OutputInterface): void;
        constructor(input: InputInterface, output: OutputInterface);

        /**
         * Build a default normalizer.
         */
        protected _getDefaultNormalizer(): Invokable<any>;

        /**
         * Build a default validator.
         */
        protected _getDefaultValidator(): Invokable<void>;

        /**
         * Ask the user for input and return the answer.
         *
         * @returns {Promise<*>}
         */
        protected ask(): Promise<any>;

        /**
         * Returns a question renderer.
         */
        protected _getRenderer(): RendererInterface;
    }
}
