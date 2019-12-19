const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;

/**
 * Yields a variadic argument's values from the request attributes.
 *
 * @final
 * @memberOf Jymfony.Component.HttpServer.Controller.ArgumentResolvers
 */
export default class VariadicValueResolver extends implementationOf(ArgumentValueResolverInterface) {
    /**
     * @inheritdoc
     */
    supports(request, argument) {
        return argument.isRestElement && request.attributes.has(argument.name);
    }

    /**
     * @inheritdoc
     */
    * resolve(request, argument) {
        const values = request.attributes.get(argument.name);
        if (! isArray(values)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The action argument "...%1$s" is required to be an array, the request attribute "%1$s" contains a type of "%2$s" instead.', argument.name, typeof values));
        }

        yield * values;
    }
}
