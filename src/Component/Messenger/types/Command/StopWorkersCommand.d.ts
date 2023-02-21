declare namespace Jymfony.Component.Messenger.Command {
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
    import Command = Jymfony.Component.Console.Command.Command;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * @memberOf Jymfony.Component.Messenger.Command
     */
    export class StopWorkersCommand extends Command {
        private _restartSignalCachePool: CacheItemPoolInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(restartSignalCachePool: CacheItemPoolInterface): void;
        constructor(restartSignalCachePool: CacheItemPoolInterface);

        public static readonly defaultName: string;

        /**
         * {@inheritdoc}
         */
        configure(): void;

        /**
         * @inheritdoc
         */
        execute(input: InputInterface, output: OutputInterface): Promise<number>;
    }
}
