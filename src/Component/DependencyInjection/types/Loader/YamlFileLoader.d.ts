declare namespace Jymfony.Component.DependencyInjection.Loader {
    import FileLocatorInterface = Jymfony.Component.Config.FileLocatorInterface;
    import Parser = Jymfony.Component.Yaml.Parser;
    import ArgumentInterface = Jymfony.Component.DependencyInjection.Argument.ArgumentInterface;

    /**
     * YamlFileLoader loads YAML files service definitions.
     */
    export class YamlFileLoader extends JsonFileLoader {
        private _yamlParser: Parser;
        private _anonymousServicesCount: number;
        private _anonymousServicesSuffix: string;

        /**
         * Constructor.
         */
        __construct(container: ContainerBuilder, locator: FileLocatorInterface, env?: string | null): void;
        constructor(container: ContainerBuilder, locator: FileLocatorInterface, env?: string | null);

        /**
         * @inheritdoc
         */
        supports(resource: any, type?: string): boolean;

        /**
         * @inheritdoc
         */
        protected _loadFile(file: string): any;

        /**
         * @inheritdoc
         */
        protected _resolveServices(value: any, file: string, isParameter?: boolean): string | string[] | Reference | ArgumentInterface;
    }
}
