const AckStamp = Jymfony.Component.Messenger.Stamp.AckStamp;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const BatchHandlerInterface = Jymfony.Component.Messenger.Handler.BatchHandlerInterface;
const BatchHandlerTrait = Jymfony.Component.Messenger.Handler.BatchHandlerTrait;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const HandleMessageMiddleware = Jymfony.Component.Messenger.Middleware.HandleMessageMiddleware;
const HandledStamp = Jymfony.Component.Messenger.Stamp.HandledStamp;
const HandlerArgumentsStamp = Jymfony.Component.Messenger.Stamp.HandlerArgumentsStamp;
const HandlerDescriptor = Jymfony.Component.Messenger.Handler.HandlerDescriptor;
const HandlersLocator = Jymfony.Component.Messenger.Handler.HandlersLocator;
const MiddlewareTestCase = Jymfony.Component.Messenger.Test.MiddlewareTestCase;
const NoAutoAckStamp = Jymfony.Component.Messenger.Stamp.NoAutoAckStamp;
const NoHandlerForMessageException = Jymfony.Component.Messenger.Exception.NoHandlerForMessageException;
const StackMiddleware = Jymfony.Component.Messenger.Middleware.StackMiddleware;

export default class HandleMessageMiddlewareTest extends MiddlewareTestCase {
    async testItCallsTheHandlerAndNextMiddleware() {
        const message = new DummyMessage('Hey');
        const envelope = new Envelope(message);

        const handler = this.prophesize(HandleMessageMiddlewareTestCallable);
        handler.__invoke(message)
            .shouldBeCalledTimes(1)
            .willReturn();

        const middleware = new HandleMessageMiddleware(new HandlersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ handler.reveal() ],
        }));

        await middleware.handle(envelope, this._getStackMock());
    }

    @dataProvider('itAddsHandledStampsProvider')
    async testItAddsHandledStamps(handlers, expectedStamps, nextIsCalled) {
        const message = new DummyMessage('Hey');
        let envelope = new Envelope(message);

        const middleware = new HandleMessageMiddleware(new HandlersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: handlers,
        }));

        try {
            envelope = await middleware.handle(envelope, this._getStackMock(nextIsCalled));
        } catch (e) {
            envelope = e.envelope;
        }

        __self.assertEquals(expectedStamps, envelope.all(HandledStamp));
    }

    * itAddsHandledStampsProvider() {
        const first = this.prophesize(HandleMessageMiddlewareTestCallable);
        first.__invoke(Argument.cetera()).willReturn('first result');
        const firstClass = ReflectionClass.getClassName(HandleMessageMiddlewareTestCallable);

        const second = this.prophesize(HandleMessageMiddlewareTestCallable);
        second.__invoke(Argument.cetera()).willReturn(null);
        const secondClass = ReflectionClass.getClassName(HandleMessageMiddlewareTestCallable);

        const failing = this.prophesize(HandleMessageMiddlewareTestCallable);
        failing.__invoke().willThrow(new Exception('handler failed.'));

        yield [
            [ first.reveal() ],
            [ new HandledStamp('first result', firstClass + '#__invoke') ],
            true,
        ];

        yield [
            [
                new HandlerDescriptor(first.reveal(), { alias: 'first' }),
                new HandlerDescriptor(second.reveal(), { alias: 'second' }),
            ],
            [
                new HandledStamp('first result', firstClass + '#__invoke@first'),
                new HandledStamp(null, secondClass + '#__invoke@second'),
            ],
            true,
        ];

        yield [
            [
                new HandlerDescriptor(first.reveal(), { alias: 'first' }),
                new HandlerDescriptor(failing.reveal(), { alias: 'failing' }),
                new HandlerDescriptor(second.reveal(), { alias: 'second' }),
            ],
            [
                new HandledStamp('first result', firstClass + '#__invoke@first'),
                new HandledStamp(null, secondClass + '#__invoke@second'),
            ],
            false,
        ];

        yield [
            [ first.reveal(), first.reveal() ],
            [
                new HandledStamp('first result', firstClass + '#__invoke'),
            ],
            true,
        ];
    }

    async testThrowsNoHandlerException() {
        this.expectException(NoHandlerForMessageException);
        this.expectExceptionMessage('No handler for message "Jymfony.Component.Messenger.Fixtures.DummyMessage".');

        const middleware = new HandleMessageMiddleware(new HandlersLocator([]));
        await middleware.handle(new Envelope(new DummyMessage('Hey')), new StackMiddleware());
    }

    async testAllowNoHandlers() {
        const middleware = new HandleMessageMiddleware(new HandlersLocator([]), true);

        __self.assertInstanceOf(Envelope, await middleware.handle(new Envelope(new DummyMessage('Hey')), new StackMiddleware()));
    }

    async testBatchHandler() {
        const handler = new class extends implementationOf(BatchHandlerInterface, BatchHandlerTrait) {
            __construct() {
                this.processedMessages = null;
            }

            __invoke(message, ack = null) {
                return this._handle(message, ack);
            }

            _shouldFlush() {
                return 2 <= this._jobs.length;
            }

            async _process(jobs) {
                this.processedMessages = jobs.map(j => j[0]);

                for (const [ job, ack ] of jobs) {
                    await ack.ack(job);
                }
            }
        }();

        const middleware = new HandleMessageMiddleware(new HandlersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ new HandlerDescriptor(handler) ],
        }));

        const ackedMessages = [];
        const ack = (envelope, e = null) => {
            if (null !== e) {
                throw e;
            }

            ackedMessages.push(envelope.last(HandledStamp).result);
        };

        const expectedMessages = [
            new DummyMessage('Hey'),
            new DummyMessage('Bob'),
        ];

        const envelopes = [];
        for (const message of expectedMessages) {
            envelopes.push(await middleware.handle(new Envelope(message, [ new AckStamp(ack) ]), new StackMiddleware()));
        }

        __self.assertEquals(expectedMessages, handler.processedMessages);
        __self.assertEquals(expectedMessages, ackedMessages);

        __self.assertNotNull(envelopes[0].last(NoAutoAckStamp));
        __self.assertNull(envelopes[1].last(NoAutoAckStamp));
    }

    async testBatchHandlerNoBatch() {
        const handler = new class extends implementationOf(BatchHandlerInterface, BatchHandlerTrait) {
            __construct() {
                this.processedMessages = null;
            }

            __invoke(message, ack = null) {
                this._handle(message, ack);
            }

            shouldFlush() {
                return false;
            }

            async _process(jobs) {
                this.processedMessages = jobs.map(j => j[0]);
                const [ job, ack ] = jobs.shift();
                await ack.ack(job);
            }
        }();

        const middleware = new HandleMessageMiddleware(new HandlersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ new HandlerDescriptor(handler) ],
        }));

        const message = new DummyMessage('Hey');
        await middleware.handle(new Envelope(message), new StackMiddleware());

        __self.assertEquals([ message ], handler.processedMessages);
    }

    async testHandlerArgumentsStamp() {
        const message = new DummyMessage('Hey');
        let envelope = new Envelope(message);
        envelope = envelope.withStamps(new HandlerArgumentsStamp([ 'additional argument' ]));

        const handler = this.prophesize(HandleMessageMiddlewareTestCallable);
        handler.__invoke(message, 'additional argument')
            .shouldBeCalledTimes(1)
            .willReturn();

        const middleware = new HandleMessageMiddleware(new HandlersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ handler.reveal() ],
        }));

        await middleware.handle(envelope, this._getStackMock());
    }
}

class HandleMessageMiddlewareTestCallable {
    __invoke() {
    }
}
