declare namespace Jymfony.Component.Console.Tester {
    import Command = Jymfony.Component.Console.Command.Command;

    /**
     * Eases the testing of command completion.
     */
    export class CommandCompletionTester {
        private _command: Command;

        /**
         * Constructor.
         */
        __construct(command: Command): void;
        constructor(command: Command);

        /**
         * Create completion suggestions from input tokens.
         */
        complete(input: string[]): Promise<string[]>;
    }
}
