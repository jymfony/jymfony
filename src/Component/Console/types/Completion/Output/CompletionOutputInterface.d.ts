declare namespace Jymfony.Component.Console.Completion.Output {
    import CompletionSuggestions = Jymfony.Component.Console.Completion.CompletionSuggestions;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * Transforms the {@see CompletionSuggestions} object into output readable by the shell completion.
     */
    export class CompletionOutputInterface {
        public static readonly definition: Newable<CompletionOutputInterface>;

        write(suggestions: CompletionSuggestions, output: OutputInterface): void;
    }
}
