const ActivationMiddleware = Jymfony.Component.Messenger.Middleware.ActivationMiddleware;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const MiddlewareTestCase = Jymfony.Component.Messenger.Test.MiddlewareTestCase;

export default class ActivationMiddlewareTest extends MiddlewareTestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    @dataProvider('provideActivation')
    async testExecuteMiddleware(expected, activation) {
        const message = new DummyMessage('Hello');
        const envelope = new Envelope(message);

        const stack = this._getStackMock(!expected);

        const middleware = this.prophesize(MiddlewareInterface);
        middleware.handle(envelope, stack)[expected ? 'shouldBeCalled' : 'shouldNotBeCalled']().willReturn(envelope);

        const decorator = new ActivationMiddleware(middleware.reveal(), activation);
        await decorator.handle(envelope, stack);
    }

    * provideActivation() {
        yield [ true, true ];
        yield [ true, () => true ];
        yield [ true, async () => true ];
        yield [ false, false ];
        yield [ false, () => false ];
        yield [ false, async () => false ];
    }
}
