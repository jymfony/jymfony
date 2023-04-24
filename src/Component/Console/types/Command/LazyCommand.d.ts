declare namespace Jymfony.Component.Console.Command {
    import CompletionInput = Jymfony.Component.Console.Completion.CompletionInput;
    import CompletionSuggestions = Jymfony.Component.Console.Completion.CompletionSuggestions;
    import InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
    import Suggestion = Jymfony.Component.Console.Completion.Suggestion;

    export class LazyCommand extends Command {
        name: string;
        aliases: string[];
        hidden: boolean;
        description: string;
        private _command: (() => Command) | Command;
        private _isEnabled: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(name: string, aliases: string[], description: string, isHidden: boolean, commandFactory: () => Command, isEnabled?: boolean): void;
        constructor(name: string, aliases: string[], description: string, isHidden: boolean, commandFactory: () => Command, isEnabled?: boolean);

        ignoreValidationError(): void;

        public /* writeonly */ application: Application;

        isEnabled(): boolean;

        run(input, output): Promise<number>;

        complete(input, suggestions): Promise<void>;

        public /* writeonly */ code: Invokable;

        /**
         * @internal
         */
        mergeApplicationDefinition(mergeArgs?: boolean): void;

        public definition: InputDefinition;

        public readonly nativeDefinition: InputDefinition;

        addArgument(name: string, mode?: number, description?: string, defaultValue?: any, suggestedValues?: (string | Suggestion)[] | ((input: CompletionInput, suggestions: CompletionSuggestions) => Promise<(string | Suggestion)[]>)): this;

        addOption(name: string, shortcut?: string|undefined, mode?: number, description?: string, defaultValue?: any, suggestedValues?: (string | Suggestion)[] | ((input: CompletionInput, suggestions: CompletionSuggestions) => Promise<(string | Suggestion)[]>)): this;

        public /* writeonly */ processTitle: string;

        public help: string;

        public readonly processedHelp: string;

        getSynopsis(short?: boolean): string;

        addUsage(usage: string): this;

        public readonly usages: string[];

        private _getCommand(): Command;
    }
}
