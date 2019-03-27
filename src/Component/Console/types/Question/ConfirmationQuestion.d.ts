declare namespace Jymfony.Component.Console.Question {
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * Represents a yes/no question.
     */
    export class ConfirmationQuestion extends Question {
        private _trueAnswerRegex: RegExp;

        /**
         * Constructor.
         *
         * @param input An input interface object
         * @param output An output interface object
         * @param question The question to ask to the user
         * @param [defaultAnswer = true] The default answer to return, true or false
         * @param [trueAnswerRegex = /^y/i] A regex to match the "yes" answer
         */
        // @ts-ignore
        __construct(input: InputInterface, output: OutputInterface, question: string, defaultAnswer?: boolean, trueAnswerRegex?: RegExp): void;
        constructor(input: InputInterface, output: OutputInterface, question: string, defaultAnswer?: boolean, trueAnswerRegex?: RegExp);

        /**
         * Returns the default answer normalizer.
         */
        protected _getDefaultNormalizer(): Invokable<boolean>;
    }
}
