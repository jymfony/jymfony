const Argument = Jymfony.Component.Testing.Argument.Argument;
const ConsumedByWorkerStamp = Jymfony.Component.Messenger.Stamp.ConsumedByWorkerStamp;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;
const ReceivedStamp = Jymfony.Component.Messenger.Stamp.ReceivedStamp;
const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;
const StopWorkerOnMessageLimitListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnMessageLimitListener;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Worker = Jymfony.Component.Messenger.Worker;

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

export default class WorkerTest extends TestCase {
    async testWorkerDispatchTheReceivedMessage() {
        const apiMessage = new DummyMessage('API');
        const ipaMessage = new DummyMessage('IPA');

        const receiver = new DummyReceiver([
            [new Envelope(apiMessage), new Envelope(ipaMessage)],
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
}
