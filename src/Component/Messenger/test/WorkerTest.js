const Argument = Jymfony.Component.Testing.Argument.Argument;
const BatchHandlerInterface = Jymfony.Component.Messenger.Handler.BatchHandlerInterface;
const BatchHandlerTrait = Jymfony.Component.Messenger.Handler.BatchHandlerTrait;
const ConsumedByWorkerStamp = Jymfony.Component.Messenger.Stamp.ConsumedByWorkerStamp;
const DateTime = Jymfony.Component.DateTime.DateTime;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
const HandleMessageMiddleware = Jymfony.Component.Messenger.Middleware.HandleMessageMiddleware;
const HandlerDescriptor = Jymfony.Component.Messenger.Handler.HandlerDescriptor;
const HandlersLocator = Jymfony.Component.Messenger.Handler.HandlersLocator;
const LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
const MessageBus = Jymfony.Component.Messenger.MessageBus;
const MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;
const QueueReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.QueueReceiverInterface;
const ReceivedStamp = Jymfony.Component.Messenger.Stamp.ReceivedStamp;
const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;
const SentStamp = Jymfony.Component.Messenger.Stamp.SentStamp;
const StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;
const StopWorkerOnMessageLimitListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnMessageLimitListener;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Worker = Jymfony.Component.Messenger.Worker;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;
const WorkerMessageHandledEvent = Jymfony.Component.Messenger.Event.WorkerMessageHandledEvent;
const WorkerMessageReceivedEvent = Jymfony.Component.Messenger.Event.WorkerMessageReceivedEvent;
const WorkerStartedEvent = Jymfony.Component.Messenger.Event.WorkerStartedEvent;
const WorkerStoppedEvent = Jymfony.Component.Messenger.Event.WorkerStoppedEvent;

export default class WorkerTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testWorkerDispatchTheReceivedMessage() {
        const apiMessage = new DummyMessage('API');
        const ipaMessage = new DummyMessage('IPA');

        const receiver = new DummyReceiver([
            [ new Envelope(apiMessage), new Envelope(ipaMessage) ],
        ]);

        const bus = this.prophesize(MessageBusInterface);
        const envelopes = [];

        bus.dispatch(Argument.type(Envelope), Argument.cetera())
            .shouldBeCalledTimes(2)
            .will(envelope => {
                envelopes.push(envelope);
                return envelope;
            });

        const dispatcher = new EventDispatcher();
        dispatcher.addSubscriber(new StopWorkerOnMessageLimitListener(2));

        const worker = new Worker({ transport: receiver }, bus.reveal(), dispatcher);
        await worker.run();

        __self.assertSame(apiMessage, envelopes[0].message);
        __self.assertSame(ipaMessage, envelopes[1].message);
        __self.assertSame(1, envelopes[0].all(ReceivedStamp).length);
        __self.assertSame(1, envelopes[0].all(ConsumedByWorkerStamp).length);
        __self.assertSame('transport', envelopes[0].last(ReceivedStamp).transportName);

        __self.assertSame(2, receiver.acknowledgeCount);
    }

    async testHandlingErrorCausesReject() {
        const receiver = new DummyReceiver([
            [ new Envelope(new DummyMessage('Hello'), [ new SentStamp('Some\Sender', 'transport1') ]) ],
        ]);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.cetera()).willThrow(new InvalidArgumentException('Why not'));

        const dispatcher = new EventDispatcher();
        dispatcher.addSubscriber(new StopWorkerOnMessageLimitListener(1));

        const worker = new Worker({ transport1: receiver }, bus.reveal(), dispatcher);
        await worker.run();

        __self.assertSame(1, receiver.rejectCount);
        __self.assertSame(0, receiver.acknowledgeCount);
    }

    async testWorkerDoesNotSendNullMessagesToTheBus() {
        const receiver = new DummyReceiver([ null ]);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.cetera()).shouldNotBeCalled();

        const dispatcher = new EventDispatcher();
        dispatcher.addListener(WorkerRunningEvent, event => {
            event.worker.stop();
        });

        const worker = new Worker([ receiver ], bus.reveal(), dispatcher);
        await worker.run();
    }

    async testWorkerDispatchesEventsOnSuccess() {
        const envelope = new Envelope(new DummyMessage('Hello'));
        const receiver = new DummyReceiver([ [ envelope ] ]);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(envelope).willReturn(envelope);

        const events = [];
        const eventDispatcher = this.prophesize(EventDispatcherInterface);
        eventDispatcher.dispatch(Argument.any())
            .shouldBeCalledTimes(5)
            .will(event => {
                events.push(event);
                if (event instanceof WorkerRunningEvent) {
                    event.worker.stop();
                }

                return event;
            });

        const worker = new Worker([ receiver ], bus.reveal(), eventDispatcher.reveal());
        await worker.run();

        __self.assertInstanceOf(WorkerStartedEvent, events[0]);
        __self.assertInstanceOf(WorkerMessageReceivedEvent, events[1]);
        __self.assertInstanceOf(WorkerMessageHandledEvent, events[2]);
        __self.assertInstanceOf(WorkerRunningEvent, events[3]);
        __self.assertInstanceOf(WorkerStoppedEvent, events[4]);
    }

    async testWorkerDispatchesEventsOnError() {
        const envelope = new Envelope(new DummyMessage('Hello'));
        const receiver = new DummyReceiver([ [ envelope ] ]);

        const bus = this.prophesize(MessageBusInterface);
        const exception = new InvalidArgumentException('Oh no!');
        bus.dispatch(Argument.any()).willThrow(exception);

        const events = [];
        const eventDispatcher = this.prophesize(EventDispatcherInterface);
        eventDispatcher.dispatch(Argument.any())
            .shouldBeCalledTimes(5)
            .will(event => {
                events.push(event);
                if (event instanceof WorkerRunningEvent) {
                    event.worker.stop();
                }

                return event;
            });

        const worker = new Worker([ receiver ], bus.reveal(), eventDispatcher.reveal());
        await worker.run();
    }

    async testWorkerContainsMetadata() {
        const envelope = new Envelope(new DummyMessage('Hello'));
        const receiver = new DummyQueueReceiver([ [ envelope ] ]);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.any()).willReturn(envelope);

        const dispatcher = new EventDispatcher();
        dispatcher.addListener(WorkerRunningEvent, event => {
            event.worker.stop();
        });

        const worker = new Worker({ dummyReceiver: receiver }, bus.reveal(), dispatcher);
        await worker.run({ queues: [ 'queue1', 'queue2' ] });

        const workerMetadata = worker.metadata;

        __self.assertEquals([ 'queue1', 'queue2' ], workerMetadata.queueNames);
        __self.assertEquals([ 'dummyReceiver' ], workerMetadata.transportNames);
    }

    @timeSensitive()
    async testTimeoutIsConfigurable() {
        const apiMessage = new DummyMessage('API');
        const receiver = new DummyReceiver([
            [ new Envelope(apiMessage), new Envelope(apiMessage) ],
            [], // Will cause a wait
            [], // Will cause a wait
            [ new Envelope(apiMessage) ],
            [ new Envelope(apiMessage) ],
            [], // Will cause a wait
            [ new Envelope(apiMessage) ],
        ]);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.any()).willReturnArgument(0);

        const dispatcher = new EventDispatcher();
        dispatcher.addSubscriber(new StopWorkerOnMessageLimitListener(5));

        const worker = new Worker([ receiver ], bus.reveal(), dispatcher);
        const startTime = DateTime.now.microtime;
        // Sleep .1 after each idle
        await worker.run({ sleep: 100000 });

        const duration = DateTime.now.microtime - startTime;
        // Wait time should be .3 seconds
        // Use .29 & .31 for timing "wiggle room"
        __self.assertGreaterThanOrEqual(.29, duration);
        __self.assertLessThan(.31, duration);
    }

    async testWorkerWithMultipleReceivers() {
        // Envelopes, in their expected delivery order
        const envelope1 = new Envelope(new DummyMessage('message1'));
        const envelope2 = new Envelope(new DummyMessage('message2'));
        const envelope3 = new Envelope(new DummyMessage('message3'));
        const envelope4 = new Envelope(new DummyMessage('message4'));
        const envelope5 = new Envelope(new DummyMessage('message5'));
        const envelope6 = new Envelope(new DummyMessage('message6'));

        /*
         * Round 1) receiver 1 & 2 have nothing, receiver 3 processes envelope1 and envelope2
         * Round 2) receiver 1 has nothing, receiver 2 processes envelope3, receiver 3 is not called
         * Round 3) receiver 1 processes envelope 4, receivers 2 & 3 are not called
         * Round 4) receiver 1 processes envelope 5, receivers 2 & 3 are not called
         * Round 5) receiver 1 has nothing, receiver 2 has nothing, receiver 3 has envelope 6
         */
        const receiver1 = new DummyReceiver([
            [],
            [],
            [ envelope4 ],
            [ envelope5 ],
            [],
        ]);
        const receiver2 = new DummyReceiver([
            [],
            [ envelope3 ],
            [],
        ]);
        const receiver3 = new DummyReceiver([
            [ envelope1, envelope2 ],
            [],
            [ envelope6 ],
        ]);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.cetera()).willReturnArgument(0);

        const processedEnvelopes = [];
        const dispatcher = new EventDispatcher();
        dispatcher.addSubscriber(new StopWorkerOnMessageLimitListener(6));
        dispatcher.addListener(WorkerMessageReceivedEvent, event => {
            processedEnvelopes.push(event.envelope);
        });

        const worker = new Worker([ receiver1, receiver2, receiver3 ], bus.reveal(), dispatcher);
        await worker.run();

        // Make sure they were processed in the correct order
        __self.assertSame([ envelope1, envelope2, envelope3, envelope4, envelope5, envelope6 ], processedEnvelopes);
    }

    async testWorkerLimitQueues() {
        const envelope = [ new Envelope(new DummyMessage('message1')) ];
        const receiver = this.prophesize(QueueReceiverInterface);
        receiver.getFromQueues('foo').willReturn(envelope);
        receiver.get(Argument.any()).shouldNotBeCalled();
        receiver.ack(Argument.any()).willReturn();

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.any()).willReturnArgument(0);

        const dispatcher = new EventDispatcher();
        dispatcher.addSubscriber(new StopWorkerOnMessageLimitListener(1));

        const worker = new Worker({ transport: receiver.reveal() }, bus.reveal(), dispatcher);
        await worker.run({ queues: [ 'foo' ] });
    }

    async testWorkerLimitQueuesUnsupported() {
        const receiver1 = this.prophesize(QueueReceiverInterface);
        const receiver2 = this.prophesize(ReceiverInterface);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.any()).willReturnArgument(0);

        const worker = new Worker({ transport1: receiver1.reveal(), transport2: receiver2.reveal() }, bus.reveal());
        this.expectException(RuntimeException);
        this.expectExceptionMessage(__jymfony.sprintf('Receiver for "transport2" does not implement "%s".', ReflectionClass.getClassName(QueueReceiverInterface)));
        await worker.run({ queues: [ 'foo' ] });
    }

    async testWorkerMessageReceivedEventMutability() {
        const envelope = new Envelope(new DummyMessage('Hello'));
        const receiver = new DummyReceiver([ [ envelope ] ]);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.any()).willReturnArgument(0);

        const eventDispatcher = new EventDispatcher();
        eventDispatcher.addSubscriber(new StopWorkerOnMessageLimitListener(1));

        const stamp = new class extends implementationOf(StampInterface) { }();
        const listener = event => {
            event.addStamps(stamp);
        };

        eventDispatcher.addListener(WorkerMessageReceivedEvent, listener);

        const worker = new Worker([ receiver ], bus.reveal(), eventDispatcher);
        await worker.run();


        __self.assertCount(1, receiver.acknowledgedEnvelopes[0].all(stamp));
    }

    testWorkerShouldLogOnStop() {
        const bus = this.prophesize(MessageBusInterface);
        const logger = this.prophesize(LoggerInterface);
        logger.info('Stopping worker.', Argument.any()).shouldBeCalledTimes(1);

        const worker = new Worker([], bus.reveal(), new EventDispatcher(), logger.reveal());
        worker.stop();
    }

    async testBatchProcessing() {
        const expectedMessages = [
            new DummyMessage('Hey'),
            new DummyMessage('Bob'),
        ];

        const receiver = new DummyReceiver([
            [ new Envelope(expectedMessages[0]) ],
            [ new Envelope(expectedMessages[1]) ],
        ]);

        const handler = new DummyBatchHandler();
        const middleware = new HandleMessageMiddleware(new HandlersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ new HandlerDescriptor(handler) ],
        }));

        const bus = new MessageBus([ middleware ]);
        const dispatcher = new EventDispatcher();

        let i = 0;
        dispatcher.addListener(WorkerRunningEvent, event => {
            if (1 < ++i) {
                event.worker.stop();
                __self.assertSame(2, receiver.acknowledgeCount);
            } else {
                __self.assertSame(0, receiver.acknowledgeCount);
            }
        });

        const worker = new Worker([ receiver ], bus, dispatcher);
        await worker.run();

        __self.assertEquals(expectedMessages, handler.processedMessages);
    }

    async testFlushBatchOnIdle() {
        const handler = new DummyBatchHandler();
        const expectedMessages = [
            new DummyMessage('Hey'),
        ];

        const receiver = new DummyReceiver([
            [ new Envelope(expectedMessages[0]) ],
            [],
        ]);

        const middleware = new HandleMessageMiddleware(new HandlersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ new HandlerDescriptor(handler) ],
        }));

        const bus = new MessageBus([ middleware ]);

        let i = 0;
        const dispatcher = new EventDispatcher();
        dispatcher.addListener(WorkerRunningEvent, event => {
            if (1 < ++i) {
                event.worker.stop();
                __self.assertSame(1, receiver.acknowledgeCount);
            } else {
                __self.assertSame(0, receiver.acknowledgeCount);
            }
        });

        const worker = new Worker([ receiver ], bus, dispatcher);
        await worker.run();

        __self.assertEquals(expectedMessages, handler.processedMessages);
    }

    async testFlushBatchOnStop() {
        const handler = new DummyBatchHandler();
        const expectedMessages = [
            new DummyMessage('Hey'),
        ];

        const receiver = new DummyReceiver([
            [ new Envelope(expectedMessages[0]) ],
        ]);

        const middleware = new HandleMessageMiddleware(new HandlersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ new HandlerDescriptor(handler) ],
        }));

        const bus = new MessageBus([ middleware ]);
        const dispatcher = new EventDispatcher();
        dispatcher.addListener(WorkerRunningEvent, event => {
            event.worker.stop();
            __self.assertSame(0, receiver.acknowledgeCount);
        });

        const worker = new Worker([ receiver ], bus, dispatcher);
        await worker.run();

        __self.assertSame(expectedMessages, handler.processedMessages);
    }
}

class DummyReceiver extends implementationOf(ReceiverInterface) {
    /**
     * @param {Jymfony.Component.Messenger.Envelope[][]} deliveriesOfEnvelopes
     */
    __construct(deliveriesOfEnvelopes) {
        /**
         * @type {Jymfony.Component.Messenger.Envelope[][]}
         *
         * @private
         */
        this._deliveriesOfEnvelopes = deliveriesOfEnvelopes;

        /**
         * @type {Jymfony.Component.Messenger.Envelope[]}
         *
         * @private
         */
        this._acknowledgedEnvelopes = [];

        /**
         * @type {Jymfony.Component.Messenger.Envelope[]}
         *
         * @private
         */
        this._rejectedEnvelopes = [];

        this._acknowledgeCount = 0;
        this._rejectCount = 0;
    }

    get() {
        const val = this._deliveriesOfEnvelopes.shift();

        return val || [];
    }

    ack(envelope) {
        ++this._acknowledgeCount;
        this._acknowledgedEnvelopes.push(envelope);
    }

    reject(envelope) {
        ++this._rejectCount;
        this._rejectedEnvelopes.push(envelope);
    }

    get acknowledgeCount() {
        return this._acknowledgeCount;
    }

    get rejectCount() {
        return this._rejectCount;
    }

    get acknowledgedEnvelopes() {
        return this._acknowledgedEnvelopes;
    }
}

class DummyQueueReceiver extends mix(DummyReceiver, QueueReceiverInterface) {
    getFromQueues() {
        return this.get();
    }
}

class DummyBatchHandler extends implementationOf(BatchHandlerInterface, BatchHandlerTrait) {
    __construct() {
        this.processedMessages = [];
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
}
