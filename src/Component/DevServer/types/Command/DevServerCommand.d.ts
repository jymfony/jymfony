declare namespace Jymfony.Component.DevServer.Command {
    import Command = Jymfony.Component.Console.Command.Command;
    import DevServer = Jymfony.Component.DevServer.DevServer;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class DevServerCommand extends Command {
        private _devServer: DevServer;

        /**
         * Constructor.
         *
         * @param {Jymfony.Component.DevServer.DevServer} devServer
         * @param {string} name
         */
        // @ts-ignore
        __construct(devServer: DevServer, name?: string): void;
        constructor(devServer: DevServer, name?: string);

        /**
         * @inheritdoc
         */
        configure(): void;

        /**
         * @inheritdoc
         */
        execute(input: InputInterface, output: OutputInterface): Promise<void>;
    }
}
