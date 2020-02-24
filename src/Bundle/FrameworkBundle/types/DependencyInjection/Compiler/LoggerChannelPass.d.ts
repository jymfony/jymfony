declare namespace Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler {
    import AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class LoggerChannelPass extends AbstractRecursivePass {
        private _channels: Set<string>;
        private _loggerId: string;

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;

        /**
         * @inheritdoc
         */
        protected _processValue(value: any, isRoot?: boolean): any;

        private _processChannels(configuration: any): IterableIterator<any>;
    }
}
