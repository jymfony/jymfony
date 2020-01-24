declare namespace Jymfony.Component.HttpServer.Controller.Metadata {
    import MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;

    export class ArgumentMetadataFactory extends implementationOf(MetadataFactoryInterface) {
        private _instances: WeakMap<Invokable, ControllerMetadata>;

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        getMetadataFor(controller: Invokable<any>): null | ControllerMetadata;

        /**
         * @inheritdoc
         */
        hasMetadataFor(controller: Invokable<any>): boolean;

        /**
         * Gets the ReflectionMethod object from the controller.
         */
        private _getReflectionMethod(controller: Invokable<any>): ReflectionMethod;
    }
}
