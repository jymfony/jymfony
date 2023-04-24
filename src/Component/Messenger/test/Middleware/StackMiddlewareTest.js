const Argument = Jymfony.Component.Testing.Argument.Argument;
const MessageBus = Jymfony.Component.Messenger.MessageBus;
const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class StackMiddlewareTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testClone() {
        const middleware1 = this.prophesize(MiddlewareInterface);
        middleware1
            .handle(Argument.cetera())
            .shouldBeCalledTimes(1)
            .will(async (envelope, stack) => {
                const fork = __jymfony.clone(stack);

                await stack.next().handle(envelope, stack);
                await fork.next().handle(envelope, fork);

                return envelope;
            });

        const middleware2 = this.prophesize(MiddlewareInterface);
        middleware2
            .handle(Argument.cetera())
            .shouldBeCalledTimes(2)
            .willReturnArgument(0);

        const bus = new MessageBus([ middleware1.reveal(), middleware2.reveal() ]);
        await bus.dispatch({});
    }
}
