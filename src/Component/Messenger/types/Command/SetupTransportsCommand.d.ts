declare namespace Jymfony.Component.Messenger.Command {
    import Command = Jymfony.Component.Console.Command.Command;
    import CompletionInput = Jymfony.Component.Console.Completion.CompletionInput;
    import CompletionSuggestions = Jymfony.Component.Console.Completion.CompletionSuggestions;
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class SetupTransportsCommand extends Command {
        private _transportLocator: ContainerInterface;
        private _transportNames: string[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(transportLocator: ContainerInterface, transportNames?: string[]): void;
        constructor(transportLocator: ContainerInterface, transportNames?: string[]);

        public static readonly defaultName: string;

        configure(): void;

        execute(input: InputInterface, output: OutputInterface): Promise<number>;

        complete(input: CompletionInput, suggestions: CompletionSuggestions): Promise<void>;
    }
}
