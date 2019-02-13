declare namespace Jymfony.Component.Console.Event {
    import Event = Jymfony.Component.EventDispatcher.Event;
    import Command = Jymfony.Component.Console.Command.Command;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * Allows to inspect input and output of a command.
     */
    class ConsoleEvent extends Event {
        protected _command: Command;

        private _input: InputInterface;
        private _output: OutputInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(command: Command|undefined, input: InputInterface, output: OutputInterface): void;
        constructor(command: Command|undefined, input: InputInterface, output: OutputInterface);

        /**
         * Gets the command that is executed.
         */
        public readonly command: Command|undefined;

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
