const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;

/**
 * Yields the default value defined in the action signature when no value has been given.
 *
 * @final
 * @memberOf Jymfony.Component.HttpServer.Controller.ArgumentResolvers
 */
export default class DefaultValueResolver extends implementationOf(ArgumentValueResolverInterface) {
    /**
     * @inheritdoc
     */
    supports(request, argument) {
        return argument.defaultValue !== undefined;
    }

    /**
     * @inheritdoc
     */
    * resolve(request, argument) {
        yield argument.defaultValue;
    }
}
