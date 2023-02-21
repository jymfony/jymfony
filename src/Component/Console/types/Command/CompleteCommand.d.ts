declare namespace Jymfony.Component.Console.Command {
    import CompletionInput = Jymfony.Component.Console.Completion.CompletionInput;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * Responsible for providing the values to the shell completion.
     * @final
     */
    export class CompleteCommand extends Command {
        public static readonly defaultName;

        private _completionOutputs: Record<string, string>;
        private _isDebug: boolean;

        /**
         * @param completionOutputs A list of additional completion outputs, with shell name as key and FQCN as value
         */
        // @ts-ignore
        __construct(completionOutputs?: Record<string, string>): void;
        constructor(completionOutputs?: Record<string, string>);

        configure(): void;

        initialize(): void;

        execute(input: InputInterface, output: OutputInterface): Promise<number>;

        private _createCompletionInput(input: InputInterface): CompletionInput;

        /**
         * @param {Jymfony.Component.Console.Completion.CompletionInput} completionInput
         *
         * @returns {Jymfony.Component.Console.Command.Command | null}
         */
        private _findCommand(completionInput: CompletionInput): null | Command;

        private _log(messages: string | string[]): void;
    }
}
