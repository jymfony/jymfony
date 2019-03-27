declare namespace Jymfony.Component.Routing.Loader.Configurator.Traits {
    import ConfiguratorInterface = Jymfony.Component.Routing.Loader.Configurator.ConfiguratorInterface;

    export class ConfiguratorTrait {
        private _children: ConfiguratorInterface[];

        __construct(): void;
        constructor();

        /**
         * Adds a configurator to this configurator.
         */
        private _push(childConfigurator: ConfiguratorInterface): ConfiguratorInterface;
    }
}
