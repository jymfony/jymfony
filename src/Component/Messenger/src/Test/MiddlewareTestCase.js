const Argument = Jymfony.Component.Testing.Argument.Argument;
const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const StackInterface = Jymfony.Component.Messenger.Middleware.StackInterface;
const StackMiddleware = Jymfony.Component.Messenger.Middleware.StackMiddleware;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

/**
 * @memberOf Jymfony.Component.Messenger.Test
 */
export default class MiddlewareTestCase extends TestCase {
    /**
     * @param {boolean} [nextIsCalled = true]
     *
     * @returns {Jymfony.Component.Messenger.Middleware.StackMiddleware}
     *
     * @protected
     */
    _getStackMock(nextIsCalled = true) {
        if (!nextIsCalled) {
            const stack = this.prophesize(StackInterface);
            stack.next(Argument.cetera()).shouldNotBeCalled();

            return stack.reveal();
        }

        const nextMiddleware = this.prophesize(MiddlewareInterface);
        nextMiddleware
            .handle(Argument.cetera())
            .shouldBeCalledTimes(1)
            .will(envelope => envelope)
        ;

        return new StackMiddleware([ nextMiddleware.reveal() ]);
    }

    /**
     * @param {Error} error
     *
     * @returns {Jymfony.Component.Messenger.Middleware.StackMiddleware}
     *
     * @protected
     */
    _getThrowingStackMock(error = null) {
        const nextMiddleware = this.prophesize(MiddlewareInterface);
        nextMiddleware
            .handle(Argument.cetera())
            .shouldBeCalledTimes(1)
            .willThrow(error || new RuntimeException('Thrown from next middleware.'))
        ;

        return new StackMiddleware([ nextMiddleware.reveal() ]);
    }
}
