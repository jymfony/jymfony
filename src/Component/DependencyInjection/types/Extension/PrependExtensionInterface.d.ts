declare namespace Jymfony.Component.DependencyInjection.Extension {
    export class PrependExtensionInterface {
        /**
         * Allows an extension to prepend the extension configurations.
         */
        prepend(container: ContainerBuilder): void;
    }
}
