const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class UselessMiddleware extends implementationOf(MiddlewareInterface) {
    handle(message, stack) {
        return stack.next().handle(message, stack);
    }
}
