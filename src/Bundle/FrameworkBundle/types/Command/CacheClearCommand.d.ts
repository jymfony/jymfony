declare namespace Jymfony.Bundle.FrameworkBundle.Command {
    import Command = Jymfony.Component.Console.Command.Command;
    import ContainerAwareInterface = Jymfony.Component.DependencyInjection.ContainerAwareInterface;
    import ContainerAwareTrait = Jymfony.Component.DependencyInjection.ContainerAwareTrait;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class CacheClearCommand extends mix(Command, ContainerAwareInterface, ContainerAwareTrait) {
        /**
         * @inheritDoc
         */
        public static readonly defaultName: string;

        /**
         * @inheritDoc
         */
        configure(): void;

        /**
         * @inheritDoc
         */
        execute(input: InputInterface, output: OutputInterface): Promise<void>;

        /**
         * Warms up the cache.
         */
        private _warmup(warmupDir: string, realCacheDir: string, enableOptionalWarmers?: boolean): Promise<void>;
    }
}
