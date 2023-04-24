declare namespace Jymfony.Component.Messenger.Command {
    import Command = Jymfony.Component.Console.Command.Command;
    import CompletionInput = Jymfony.Component.Console.Completion.CompletionInput;
    import CompletionSuggestions = Jymfony.Component.Console.Completion.CompletionSuggestions;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * A console command to debug Messenger information.
     */
    export class DebugCommand extends Command {
        private _mapping: Record<string, Record<string, Record<string, string>>>;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(mapping: Record<string, Record<string, Record<string, string>>>): void;
        constructor(mapping: Record<string, Record<string, Record<string, string>>>);

        /**
         * @inheritDoc
         */
        configure(): void;

        /**
         * @inheritDoc
         */
        execute(input: InputInterface, output: OutputInterface): number;

        private _formatConditions(options: Record<string, any>): string;

        static getClassDescription(klass: string | Newable): string;

        complete(input: CompletionInput, suggestions: CompletionSuggestions): void;
    }
}
