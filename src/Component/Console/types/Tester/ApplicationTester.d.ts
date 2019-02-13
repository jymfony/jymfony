declare namespace Jymfony.Component.Console.Tester {
    import ArrayInput = Jymfony.Component.Console.Input.ArrayInput;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;

    export class ApplicationTester {
        /**
         * Gets the input instance used by the last execution of application.
         */
        public readonly input: InputInterface;

        /**
         * Gets the output instance used by the last execution of application.
         */
        public readonly output: OutputInterface;

        /**
         * Gets the status code returned by the last execution of the application
         * if run has been completed.
         */
        public readonly exitCode: number;

        private _application: Application;
        private _readOutput: string;
        private _readStdErr: string;
        private _input: ArrayInput;
        private _statusCode: number;
        private _captureStdErrSeparately: boolean;
        private _output: OutputInterface;

        /**
         * Constructor.
         */
        __construct(application: Application): void;
        constructor(application: Application);

        /**
         * Executes the application.
         *
         * Options:
         *  * interactive      Sets the input interactive flag [false]
         *  * decorated        Sets the decorated flag [false]
         *  * verbosity        Sets the output verbosity level [VERBOSITY_NORMAL]
         *  * stderr           Whether to capture stderr separately from stdout [false]
         */
        run(input: Record<string, any>, options: Record<string, boolean|any>): Promise<number>;

        /**
         * Gets the display returned by the last execution of the application.
         *
         * @param [normalize = false] Whether to normalize end of lines to \n or not
         */
        getDisplay(normalize?: boolean): string;

        /**
         * Gets the output written to STDERR by the application.
         *
         * @param [normalize = false] Whether to normalize end of lines to \n or not
         *
         * @throws {LogicException} If application has not run with stderr option.
         */
        getErrorDisplay(normalize?: boolean): string;
    }
}
