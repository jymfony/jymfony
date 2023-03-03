declare namespace Jymfony.Component.Console.Command {
    import CompletionInput = Jymfony.Component.Console.Completion.CompletionInput;
    import CompletionSuggestions = Jymfony.Component.Console.Completion.CompletionSuggestions;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * Dumps the completion script for the current shell.
     *
     * @final
     */
    export class DumpCompletionCommand extends Command {
        complete(input: CompletionInput, suggestions: CompletionSuggestions): Promise<void>;

        configure(): void;

        execute(input: InputInterface, output: OutputInterface): Promise<number>;

        private static _guessShell(): string;
        private _tailDebugLog(commandName: string, output: OutputInterface): Promise<void>;
        private _getSupportedShells(): Promise<string[]>
    }
}
