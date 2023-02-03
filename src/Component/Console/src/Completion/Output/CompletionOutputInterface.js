/**
 * Transforms the {@see CompletionSuggestions} object into output readable by the shell completion.
 *
 * @memberOf Jymfony.Component.Console.Completion.Output
 */
class CompletionOutputInterface {
    /**
     * @param {Jymfony.Component.Console.Completion.CompletionSuggestions} suggestions
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     */
    write(suggestions, output) { }
}

export default getInterface(CompletionOutputInterface);
