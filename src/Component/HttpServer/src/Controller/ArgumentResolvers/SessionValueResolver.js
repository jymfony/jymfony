const ReflectionHelper = Jymfony.Component.Autoloader.Reflection.ReflectionHelper;
const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;
const SessionInterface = Jymfony.Component.HttpFoundation.Session.SessionInterface;

/**
 * Yields the same instance as the request object passed along.
 *
 * @final
 * @memberOf Jymfony.Component.HttpServer.Controller.ArgumentResolvers
 */
export default class SessionValueResolver extends implementationOf(ArgumentValueResolverInterface) {
    /**
     * @inheritdoc
     */
    supports(request, argument) {
        if (! request.hasSession()) {
            return false;
        }

        const type = ReflectionHelper.getParameterType(argument);

        return (
            type === SessionInterface || type === ReflectionClass.getClassName(SessionInterface) ||
            (new ReflectionClass(type).isSubclassOf(SessionInterface))
        ) && request.session instanceof SessionInterface;
    }

    /**
     * @inheritdoc
     */
    * resolve(request) {
        yield request.session;
    }
}
