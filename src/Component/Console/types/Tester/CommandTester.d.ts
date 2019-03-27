declare namespace Jymfony.Component.Console.Tester {
    import Command = Jymfony.Component.Console.Command.Command;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import ArrayInput = Jymfony.Component.Console.Input.ArrayInput;

    export class CommandTester {
        /**
         * Gets the input instance used by the last execution of application.
         */
        public readonly input: InputInterface;

        /**
         * Sets the user input.
         */
        public /* writeonly */ inputs: string[];

        /**
         * Gets the output instance used by the last execution of application.
         */
        public readonly output: OutputInterface;

        /**
         * Gets the status code returned by the last execution of the application
         * if run has been completed.
         */
        public readonly exitCode: number;

        private _command: Command;
        private _inputs: string[];
        private _readOutput: string;
        private _input?: ArrayInput;
        private _statusCode?: number;
        private _output?: OutputInterface;

        /**
         * Constructor.
         */
        __construct(command: Command): void;

        constructor(command: Command);

        /**
         * Executes the application.
         *
         * Options:
         *  * interactive      Sets the input interactive flag [false]
         *  * decorated        Sets the decorated flag [false]
         *  * verbosity        Sets the output verbosity level [VERBOSITY_NORMAL]
         */
        run(input: Record<string, any>, options: Record<string, boolean | any>): Promise<number>;

        /**
         * Gets the display returned by the last execution of the application.
         *
         * @param [normalize = false] Whether to normalize end of lines to \n or not
         */
        getDisplay(normalize?: boolean): string;

        /**
         * Create a stream with given inputs.
         */
        private static _createStream(inputs: string[]): NodeJS.ReadableStream;
    }
}
