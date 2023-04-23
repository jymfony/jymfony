const Argument = Jymfony.Component.Testing.Argument.Argument;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Envelope = Jymfony.Component.Messenger.Envelope;
const DelayedMessageHandlingException = Jymfony.Component.Messenger.Exception.DelayedMessageHandlingException;
const MessageBus = Jymfony.Component.Messenger.MessageBus;
const DispatchAfterCurrentBusMiddleware = Jymfony.Component.Messenger.Middleware.DispatchAfterCurrentBusMiddleware;
const MiddlewareInterface = Jymfony.Component.Messenger.Middleware.MiddlewareInterface;
const DispatchAfterCurrentBusStamp = Jymfony.Component.Messenger.Stamp.DispatchAfterCurrentBusStamp;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;

export default class DispatchAfterCurrentBusMiddlewareTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testEventsInNewTransactionAreHandledAfterMainMessage() {
        const message = new DummyMessage('Hello');

        const firstEvent = new DummyEvent('First event');
        const secondEvent = new DummyEvent('Second event');
        const thirdEvent = new DummyEvent('Third event');

        const middleware = new DispatchAfterCurrentBusMiddleware();
        const handlingMiddleware = this.prophesize(MiddlewareInterface);

        const eventBus = new MessageBus([
            middleware,
            handlingMiddleware.reveal(),
        ]);

        const messageBus = new MessageBus([
            middleware,
            new DispatchingMiddleware(eventBus, [
                new Envelope(firstEvent, [ new DispatchAfterCurrentBusStamp() ]),
                new Envelope(secondEvent, [ new DispatchAfterCurrentBusStamp() ]),
                thirdEvent, // Not in a new transaction
            ]),
            handlingMiddleware.reveal(),
        ]);

        const args = [ thirdEvent, message, firstEvent, secondEvent ];
        let call = 0;
        handlingMiddleware.handle(Argument.cetera())
            .shouldBeCalled()
            .will((envelope, stack) => {
                __self.assertEquals(args[call++], envelope.message);
                return stack.next().handle(envelope);
            });

        await messageBus.dispatch(message);
    }

    async testThrowingEventsHandlingWontStopExecution() {
        const message = new DummyMessage('Hello');

        const firstEvent = new DummyEvent('First event');
        const secondEvent = new DummyEvent('Second event');

        const middleware = new DispatchAfterCurrentBusMiddleware();
        const handlingMiddleware = this.prophesize(MiddlewareInterface);

        const eventBus = new MessageBus([
            middleware,
            handlingMiddleware.reveal(),
        ]);

        const messageBus = new MessageBus([
            middleware,
            new DispatchingMiddleware(eventBus, [
                new Envelope(firstEvent, [ new DispatchAfterCurrentBusStamp() ]),
                new Envelope(secondEvent, [ new DispatchAfterCurrentBusStamp() ]),
            ]),
            handlingMiddleware.reveal(),
        ]);

        const args = [ message, firstEvent, secondEvent ];
        let call = 0;
        handlingMiddleware.handle(Argument.cetera())
            .shouldBeCalled()
            .will((envelope, stack) => {
                __self.assertEquals(args[call++], envelope.message);
                if (2 === call) {
                    throw new RuntimeException('Some exception while handling first event');
                }

                return stack.next().handle(envelope);
            });

        this.expectException(DelayedMessageHandlingException);
        this.expectExceptionMessage('A delayed message handler threw an exception:\n\nRuntimeException: Some exception while handling first event');

        await messageBus.dispatch(message);
    }

    async testLongChainWithExceptions() {
        const command = new DummyMessage('Level 0');

        const eventL1a = new DummyEvent('Event level 1A');
        const eventL1b = new DummyEvent('Event level 1B'); // Will dispatch 2 more events
        const eventL1c = new DummyEvent('Event level 1C');

        const eventL2a = new DummyEvent('Event level 2A'); // Will dispatch 1 event and throw exception
        const eventL2b = new DummyEvent('Event level 2B'); // Will dispatch 1 event

        const eventL3a = new DummyEvent('Event level 3A'); // This should never get handled.
        const eventL3b = new DummyEvent('Event level 3B');

        const middleware = new DispatchAfterCurrentBusMiddleware();
        const handlingMiddleware = this.prophesize(MiddlewareInterface);

        const eventBus = new MessageBus([
            middleware,
            handlingMiddleware.reveal(),
        ]);

        // The command bus will dispatch 3 events.
        const commandBus = new MessageBus([
            middleware,
            new DispatchingMiddleware(eventBus, [
                new Envelope(eventL1a, [ new DispatchAfterCurrentBusStamp() ]),
                new Envelope(eventL1b, [ new DispatchAfterCurrentBusStamp() ]),
                new Envelope(eventL1c, [ new DispatchAfterCurrentBusStamp() ]),
            ]),
            handlingMiddleware.reveal(),
        ]);

        const args = [
            // Expect main dispatched message to be handled first:
            command,
            eventL1a,
            eventL1b,
            eventL1c,
            // Handle eventL2a will dispatch event and throw exception
            eventL2a,
            // Make sure eventL2b is handled, since it was dispatched from eventL1b
            eventL2b,
            // We don't handle exception L3a since L2a threw an exception.
            eventL3b,
        ];

        let call = 0;
        handlingMiddleware.handle(Argument.cetera())
            .shouldBeCalled()
            .will(async (envelope, stack) => {
                __self.assertEquals(args[call++], envelope.message);
                if (3 === call) {
                    const envelope1 = new Envelope(eventL2a, [ new DispatchAfterCurrentBusStamp() ]);
                    await eventBus.dispatch(envelope1);
                    await eventBus.dispatch(new Envelope(eventL2b, [ new DispatchAfterCurrentBusStamp() ]));

                    return stack.next().handle(envelope, stack);
                } else if (5 === call) {
                    await eventBus.dispatch(new Envelope(eventL3a, [ new DispatchAfterCurrentBusStamp() ]));
                    throw new RuntimeException('Some exception while handling Event level 2a');
                } else if (6 === call) {
                    await eventBus.dispatch(new Envelope(eventL3b, [ new DispatchAfterCurrentBusStamp() ]));
                    return stack.next().handle(envelope, stack);
                }

                return stack.next().handle(envelope);
            });

        this.expectException(DelayedMessageHandlingException);
        this.expectExceptionMessage('A delayed message handler threw an exception:\n\nRuntimeException: Some exception while handling Event level 2a');

        await commandBus.dispatch(command);
    }

    async testHandleDelayedEventFromQueue() {
        const message = new DummyMessage('Hello');
        const event = new DummyEvent('Event on queue');

        const middleware = new DispatchAfterCurrentBusMiddleware();
        const commandHandlingMiddleware = this.prophesize(MiddlewareInterface);
        const eventHandlingMiddleware = this.prophesize(MiddlewareInterface);

        // This bus simulates the bus that are used when messages come back form the queue
        const messageBusAfterQueue = new MessageBus([
            // Create a new middleware
            new DispatchAfterCurrentBusMiddleware(),
            eventHandlingMiddleware.reveal(),
        ]);

        const fakePutMessageOnQueue = this.prophesize(MiddlewareInterface);
        fakePutMessageOnQueue.handle(Argument.cetera())
            .will(async envelope => {
                // Fake putting the message on the queue
                // Fake reading the queue
                // Now, we add the message back to a new bus.
                await messageBusAfterQueue.dispatch(envelope);
                return envelope;
            });

        const eventBus = new MessageBus([
            middleware,
            fakePutMessageOnQueue.reveal(),
        ]);

        const messageBus = new MessageBus([
            middleware,
            new DispatchingMiddleware(eventBus, [
                new Envelope(event, [ new DispatchAfterCurrentBusStamp() ]),
            ]),
            commandHandlingMiddleware.reveal(),
        ]);

        commandHandlingMiddleware.handle(Argument.that(envelope => envelope.message === message), Argument.cetera())
            .shouldBeCalledTimes(1)
            .will((envelope, stack) => stack.next().handle(envelope, stack));
        eventHandlingMiddleware.handle(Argument.that(envelope => envelope.message === event), Argument.cetera())
            .shouldBeCalledTimes(1)
            .will((envelope, stack) => stack.next().handle(envelope, stack));

        await messageBus.dispatch(message);
    }

    async testDispatchOutOfAnotherHandlerDispatchesAndRemoveStamp() {
        const event = new DummyEvent('First event');

        const middleware = new DispatchAfterCurrentBusMiddleware();
        const handlingMiddleware = this.prophesize(MiddlewareInterface);

        handlingMiddleware.handle(Argument.that(envelope => envelope.message === event), Argument.cetera())
            .shouldBeCalled()
            .will((envelope, stack) => stack.next().handle(envelope));

        const eventBus = new MessageBus([
            middleware,
            handlingMiddleware.reveal(),
        ]);

        const envelope = await eventBus.dispatch(event, [ new DispatchAfterCurrentBusStamp() ]);
        __self.assertNull(envelope.last(DispatchAfterCurrentBusStamp));
    }
}

class DummyEvent {
    __construct(message) {
        this._message = message;
    }

    get message() {
        return this._message;
    }
}

class DispatchingMiddleware extends implementationOf(MiddlewareInterface) {
    __construct(bus, messages) {
        this._bus = bus;
        this._messages = messages;
    }

    async handle(envelope, stack) {
        for (const event of this._messages) {
            await this._bus.dispatch(event);
        }

        return stack.next().handle(envelope, stack);
    }
}
