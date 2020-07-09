declare namespace Jymfony.Component.Console {
    import Command = Jymfony.Component.Console.Command.Command;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class SingleCommandApplication extends Command {
        /**
         * Sets the application version.
         */
        public /* writeonly */ version: string;

        private _version: string;
        private _running: boolean;

        constructor(name?: string);
        __construct(name?: string): void;

        /**
         * @inheritdoc
         */
        run(input?: InputInterface, output?: OutputInterface): Promise<number>;
    }
}

