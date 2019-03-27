declare namespace Jymfony.Component.Console.Question {
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import RendererInterface = Jymfony.Component.Console.Question.Renderer.RendererInterface;

    /**
     * Represents a question with choices
     * It is strongly recommended to create a question with the help of a
     * QuestionBuilder object
     */
    export class PasswordQuestion extends Question {
        /**
         * If the input should be hidden.
         */
        public hidden: boolean;

        /**
         * Mask character if input is not hidden.
         */
        public mask: string;

        /**
         * @inheritdoc
         */
        __construct(input: InputInterface, output: OutputInterface): void;
        constructor(input: InputInterface, output: OutputInterface);

        /**
         * @inheritdoc
         */
        protected _getRenderer(): RendererInterface;
    }
}
