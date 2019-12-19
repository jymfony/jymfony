const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;

/**
 * Yields a non-variadic argument's value from the request attributes.
 *
 * @final
 * @memberOf Jymfony.Component.HttpServer.Controller.ArgumentResolvers
 */
export default class RequestAttributeValueResolver extends implementationOf(ArgumentValueResolverInterface) {
    /**
     * @inheritdoc
     */
    supports(request, argument) {
        return ! argument.isRestElement && request.attributes.has(argument.name);
    }

    /**
     * @inheritdoc
     */
    * resolve(request, argument) {
        yield request.attributes.get(argument.name);
    }
}
