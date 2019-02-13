declare namespace Jymfony.Bundle.FrameworkBundle.DependencyInjection {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import Extension = Jymfony.Component.DependencyInjection.Extension.Extension;
    import ConfigurationInterface = Jymfony.Component.Config.Definition.ConfigurationInterface;
    import LoaderInterface = Jymfony.Component.Config.Loader.LoaderInterface;

    export class FrameworkExtension extends Extension {
        private _sessionConfigEnabled: boolean;

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        load(configs: any[], container: ContainerBuilder): void;

        /**
         * Returns the extension configuration object.
         */
        getConfiguration(config: any[], container: ContainerBuilder): ConfigurationInterface;

        private _registerSessionConfiguration(config: any, container: ContainerBuilder, loader: LoaderInterface): void;

        private _registerConsoleConfiguration(config: any, container: ContainerBuilder, loader: LoaderInterface): void;

        private _registerLoggerConfiguration(config: any, container: ContainerBuilder, loader: LoaderInterface): void;

        private _buildLoggerHandler(container: ContainerBuilder, name: string, handler: any): string;

        private _registerRouterConfiguration(config: any, container: ContainerBuilder, loader: LoaderInterface): void;

        private _registerHttpServerConfiguration(config: any, container: ContainerBuilder, loader: LoaderInterface): void;

        private _registerCacheConfiguration(config: any, container: ContainerBuilder, loader: LoaderInterface): void;

        private _registerDevServer(container: ContainerBuilder, loader: LoaderInterface): void;

        private _registerTemplatingConfiguration(config: any, container: ContainerBuilder, loader: LoaderInterface): void;

        private _registerMime(loader: LoaderInterface): void;
    }
}
