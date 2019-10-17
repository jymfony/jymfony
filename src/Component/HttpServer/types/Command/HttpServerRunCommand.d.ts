declare namespace Jymfony.Component.HttpServer.Command {
    import Command = Jymfony.Component.Console.Command.Command;
    import InputInterface = Jymfony.Contracts.Console.InputInterface;
    import OutputInterface = Jymfony.Contracts.Console.OutputInterface;

    export class HttpServerRunCommand extends Command {
        /**
         * @inheritDoc
         */
        public static readonly defaultName: string;

        private _server: HttpServer;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(server: HttpServer): void;
        constructor(server: HttpServer);

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
