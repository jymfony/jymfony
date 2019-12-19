declare namespace Jymfony.Component.HttpServer.Controller.ArgumentResolvers {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

    /**
     * Yields a variadic argument's values from the request attributes.
     *
     * @final
     */
    export class VariadicValueResolver extends implementationOf(ArgumentValueResolverInterface) {
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
