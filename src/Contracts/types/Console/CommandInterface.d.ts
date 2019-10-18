declare namespace Jymfony.Contracts.Console {
    import OutputInterface = Jymfony.Contracts.Console.OutputInterface;
    import InputInterface = Jymfony.Contracts.Console.InputInterface;

    export class CommandInterface implements MixinInterface {
        public static readonly definition: Newable<CommandInterface>;

        /**
         * The description for the command.
         */
        public description: string;

        /**
         * The help for the command
         */
        public help: string;

        /**
         * Gets/sets the name of the command.
         *
         * Can set both the namespace and the name if you separate them by a colon (:)
         *
         *     command.name = 'foo:bar';
         */
        public name: string;

        /**
         * Configures the current command.
         */
        configure(): void;

        /**
         * Runs the command.
         *
         * The code to execute is either defined by overriding the execute() method
         * in a sub-class.
         *
         * @returns The command exit code
         *
         * @see execute()
         */
        run(input: InputInterface, output: OutputInterface): Promise<number>;

        /**
         * Adds an argument.
         *
         * @param name The argument name
         * @param [mode] The argument mode: InputArgument.REQUIRED or InputArgument.OPTIONAL
         * @param [description = ''] A description text
         * @param [defaultValue] The default value (for InputArgument::OPTIONAL mode only)
         *
         * @returns The current instance
         */
        addArgument(name: string, mode?: number, description?: string, defaultValue?: any): this;

        /**
         * Adds an option.
         *
         * @param name The option name
         * @param [shortcut] The shortcut (can be null)
         * @param [mode] The option mode: One of the InputOption.VALUE_* constants
         * @param [description = ''] A description text
         * @param [defaultValue] The default value (must be undefined for InputOption.VALUE_NONE)
         *
         * @returns The current instance
         */
        addOption(name: string, shortcut?: string|undefined, mode?: number, description?: string, defaultValue?: any): this;

        /**
         * Returns the synopsis for the command.
         *
         * @param [short = false] Whether to show the short version of the synopsis (with options folded) or not
         */
        getSynopsis(short?: boolean): string;
    }
}
