declare namespace Jymfony.Component.Console.Question.Builder {
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * Helper class to easily build Question objects.
     */
    export class QuestionBuilder {
        public input: InputInterface;
        public output: OutputInterface;

        /**
         * Value normalizer.
         */
        protected _normalizer: Invokable<any>;

        /**
         * Value validator.
         */
        protected _validator: Invokable<void>;

        /**
         * Question type from QuestionType enum.
         */
        private _type: string;

        /**
         * Constructor.
         */
        __construct(input: InputInterface, output: OutputInterface): void;
        constructor(input: InputInterface, output: OutputInterface);

        /**
         * Creates a new QuestionBuilder object.
         */
        static create(input: InputInterface, output: OutputInterface): QuestionBuilder;

        /**
         * Sets the question type.
         */
        setType(type: string): this;

        /**
         * Sets the prompt shown to the user.
         */
        setPrompt(prompt: string): this;

        /**
         * Sets the normalizer for the question value.
         * NOTE that it will be called before input validation.
         */
        setNormalizer(normalizer: undefined|Invokable<any>): this;

        /**
         * Sets the validator function.
         * The function should throw an instance of InvalidArgumentException.
         * In case another exception or error is thrown it will be propagated
         * to the Application.
         */
        setValidator(validator: Invokable<void>): this;

        /**
         * Sets the iterable for the autocomplete values.
         */
        setAutocompleteValues(autocompleterValues: string[]|Iterable<string>): this;

        /**
         * Sets the default answer for the question.
         */
        setDefault(defaultAnswer: any): this;

        /**
         * Builds the Question object.
         */
        build(): Question;
    }
}
