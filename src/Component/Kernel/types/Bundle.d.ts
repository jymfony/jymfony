declare namespace Jymfony.Component.Kernel {
    import ContainerAwareInterface = Jymfony.Component.DependencyInjection.ContainerAwareInterface;
    import ContainerAwareTrait = Jymfony.Component.DependencyInjection.ContainerAwareTrait;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import ExtensionInterface = Jymfony.Component.DependencyInjection.Extension.ExtensionInterface;

    export class Bundle extends implementationOf(ContainerAwareInterface, ContainerAwareTrait) {
        private _namespace: string;
        private _name: string;
        private _extension: ExtensionInterface;
        private _path: string;

        __construct(): void;
        constructor();

        /**
         * Boots the bundle.
         */
        boot(): Promise<void>;

        /**
         * Shutdowns the Bundle.
         */
        shutdown(): Promise<void>;

        /**
         * Builds the bundle.
         */
        build(container: ContainerBuilder): void;

        /**
         * Gets the Bundle directory path.
         *
         * The path should always be returned as a Unix path (with /).
         *
         * @returns The Bundle absolute path
         */
        public readonly path: string;

        getName(): string;

        getNamespace(): string;

        getParent(): Bundle | undefined;

        getContainerExtension(): ExtensionInterface | undefined;

        private _createContainerExtension(): ExtensionInterface;

        private _getContainerExtensionClass(): string;

        private _parseClassName(): void;
    }
}
