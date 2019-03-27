declare namespace Jymfony.Component.Console.Question {
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import RendererInterface = Jymfony.Component.Console.Question.Renderer.RendererInterface;

    /**
     * Represents a question with choices
     * It is strongly recommended to create a question with the help of a
     * QuestionBuilder object
     *
     * @memberOf Jymfony.Component.Console.Question
     */
    export class ChoiceQuestion extends Question {
        public static readonly MODE_LIST = 'list';
        public static readonly MODE_RAWLIST = 'raw_list';

        /**
         * The current question mode. Should be one of
         * the ChoiceQuestion.MODE_* constants.
         */
        public mode: string;

        /**
         * The choices.
         */
        public choices: Choice[];

        /**
         * Set this to true if this is a multiselect choice.
         */
        public multiple: boolean;

        private _choices: Choice[];
        private _multiple: boolean;

        /**
         * Constructor.
         *
         * @param {Jymfony.Component.Console.Input.InputInterface} input
         * @param {Jymfony.Component.Console.Output.OutputInterface} output
         * @param {Jymfony.Component.Console.Question.Choice[]} choices
         * @param {string} [mode = Jymfony.Component.Console.Question.ChoiceQuestion.MODE_LIST]
         */
        // @ts-ignore
        __construct(input: InputInterface, output: OutputInterface, choices: Choice[], mode?: string): void;
        constructor(input: InputInterface, output: OutputInterface, choices: Choice[], mode?: string);

        /**
         * @inheritdoc
         */
        protected ask(): Promise<any>;

        /**
         * @inheritdoc
         */
        protected _getRenderer(): RendererInterface;
    }
}
