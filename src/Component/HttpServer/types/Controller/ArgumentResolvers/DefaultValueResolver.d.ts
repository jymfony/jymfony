declare namespace Jymfony.Component.HttpServer.Controller.ArgumentResolvers {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    /**
     * Yields the default value defined in the action signature when no value has been given.
     *
     * @final
     */
    export class DefaultValueResolver extends implementationOf(ArgumentValueResolverInterface) {
        /**
         * @inheritdoc
         */
        supports(request: RequestInterface, argument: ReflectionParameter): boolean;

        /**
         * @inheritdoc
         */
        resolve(request: RequestInterface, argument: ReflectionParameter): Iterator<any>;
    }
}
