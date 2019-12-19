declare namespace Jymfony.Component.HttpServer.Controller {
    import Request = Jymfony.Component.HttpFoundation.Request;

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
        __construct(argumentValueResolvers?: Iterator<ArgumentValueResolverInterface>): void;
        constructor(argumentValueResolvers?: Iterator<ArgumentValueResolverInterface>);

        /**
         * @inheritdoc
         */
        getArguments(request: Request, controller: Invokable<any>): Promise<any[]>;

        /**
         * Gets the default argument value resolvers.
         */
        static getDefaultArgumentValueResolvers(): ArgumentValueResolverInterface[];

        /**
         * Gets the ReflectionMethod object from the controller.
         */
        private _getReflectionMethod(controller: Invokable<any>): ReflectionMethod;
    }
}
