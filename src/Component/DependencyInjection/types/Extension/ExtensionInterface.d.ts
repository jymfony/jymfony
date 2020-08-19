declare namespace Jymfony.Component.DependencyInjection.Extension {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class ExtensionInterface {
        public static readonly definition: Newable<ExtensionInterface>;

        /**
         * Namespace to be used for this extension.
         */
        public readonly namespace: string;

        /**
         * Configuration alias.
         */
        public readonly alias: string;

        /**
         * Base path for the XSD files.
         */
        public readonly xsdValidationBasePath: string;

        /**
         * Loads a configuration.
         */
        load(configs: any[], container: ContainerBuilder): void;
    }
}
