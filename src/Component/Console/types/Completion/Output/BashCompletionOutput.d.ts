declare namespace Jymfony.Component.Console.Completion.Output {
    import CompletionSuggestions = Jymfony.Component.Console.Completion.CompletionSuggestions;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * @memberOf Jymfony.Component.Console.Completion.Output
     */
    export class BashCompletionOutput extends implementationOf(CompletionOutputInterface) {
        write(suggestions: CompletionSuggestions, output: OutputInterface): void;
    }
}
