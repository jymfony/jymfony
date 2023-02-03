const CompletionOutputInterface = Jymfony.Component.Console.Completion.Output.CompletionOutputInterface;

/**
 * @memberOf Jymfony.Component.Console.Completion.Output
 */
export default class BashCompletionOutput extends implementationOf(CompletionOutputInterface) {
    write(suggestions, output) {
        const values = suggestions.valueSuggestions;
        for (const option of suggestions.optionSuggestions) {
            values.push('--' + option.getName());
            if (option.isNegatable()) {
                values.push('--no-' + option.getName());
            }
        }
        output.writeln(values.join('\n'));
    }
}
