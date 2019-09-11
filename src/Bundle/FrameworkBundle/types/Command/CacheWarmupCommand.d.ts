declare namespace Jymfony.Bundle.FrameworkBundle.Command {
    import Command = Jymfony.Component.Console.Command.Command;
    import CacheWarmerInterface = Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    /**
     * Warmup the cache.
     *
     * @final
     */
    export class CacheWarmupCommand extends Command {
        /**
         * @inheritDoc
         */
        public static readonly defaultName: string;

        private _cacheWarmer: CacheWarmerInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(cacheWarmer: CacheWarmerInterface): void;
        constructor(cacheWarmer: CacheWarmerInterface);

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
