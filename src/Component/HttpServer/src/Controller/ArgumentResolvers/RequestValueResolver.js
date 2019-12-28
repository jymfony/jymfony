const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;
const Request = Jymfony.Component.HttpFoundation.Request;
const RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;

/**
 * Yields the same instance as the request object passed along.
 *
 * @final
 * @memberOf Jymfony.Component.HttpServer.Controller.ArgumentResolvers
 */
export default class RequestValueResolver extends implementationOf(ArgumentValueResolverInterface) {
    /**
     * @inheritdoc
     */
    supports(request, argument) {
        const type = argument.type;
        if (! type) {
            return false;
        }

        return type === Request || type === ReflectionClass.getClassName(Request) ||
            (new ReflectionClass(type).isInstanceOf(RequestInterface));
    }

    /**
     * @inheritdoc
     */
    * resolve(request) {
        yield request;
    }
}
