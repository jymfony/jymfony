declare namespace Jymfony.Component.HttpServer.Controller.ArgumentResolvers {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    /**
     * Yields a non-variadic argument's value from the request attributes.
     *
     * @final
     * @memberOf Jymfony.Component.HttpServer.Controller.ArgumentResolvers
     */
    export class RequestAttributeValueResolver extends implementationOf(ArgumentValueResolverInterface) {
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
