declare namespace Jymfony.Component.HttpServer.Controller {
    import Request = Jymfony.Component.HttpFoundation.Request;
    import ControllerMetadata = Jymfony.Component.HttpServer.Controller.Metadata.ControllerMetadata;
    import MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;

    /**
     * Responsible for resolving the arguments passed to an action.
     *
     * @final
     */
    export class ArgumentResolver extends implementationOf(ArgumentResolverInterface) {
        private _argumentValueResolvers: ArgumentValueResolverInterface[];

        /**
         * Constructor.
         */
        __construct(argumentMetadataFactory: MetadataFactoryInterface, argumentValueResolvers?: Iterator<ArgumentValueResolverInterface>): void;
        constructor(argumentMetadataFactory: MetadataFactoryInterface, argumentValueResolvers?: Iterator<ArgumentValueResolverInterface>);

        /**
         * @inheritdoc
         */
        getArguments(request: Request, controller: Invokable<any>): Promise<any[]>;

        /**
         * Gets the default argument value resolvers.
         */
        static getDefaultArgumentValueResolvers(): ArgumentValueResolverInterface[];

        /**
         * Gets the ControllerMetadata object from the controller.
         */
        private _getMetadata(controller: Invokable<any>): null | ControllerMetadata;
    }
}
