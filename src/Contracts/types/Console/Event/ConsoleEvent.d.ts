declare namespace Jymfony.Contracts.Console.Event {
    import Event = Jymfony.Contracts.EventDispatcher.Event;

    /**
     * Allows to inspect input and output of a command.
     */
    export class ConsoleEvent extends Event {
        protected _command: CommandInterface;

        private _input: InputInterface;
        private _output: OutputInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(command: CommandInterface|undefined, input: InputInterface, output: OutputInterface): void;
        constructor(command: CommandInterface|undefined, input: InputInterface, output: OutputInterface);

        /**
         * Gets the command that is executed.
         */
        public readonly command: CommandInterface|undefined;

        /**
         * Gets the input instance.
         */
        public readonly input: InputInterface;

        /**
         * Gets the output instance.
         */
        public readonly output: OutputInterface;
    }
}
