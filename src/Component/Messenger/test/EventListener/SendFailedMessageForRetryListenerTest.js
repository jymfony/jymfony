const Argument = Jymfony.Component.Testing.Argument.Argument;
const ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
const DelayStamp = Jymfony.Component.Messenger.Stamp.DelayStamp;
const Envelope = Jymfony.Component.Messenger.Envelope;
const EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
const RecoverableMessageHandlingException = Jymfony.Component.Messenger.Exception.RecoverableMessageHandlingException;
const RedeliveryStamp = Jymfony.Component.Messenger.Stamp.RedeliveryStamp;
const RetryStrategyInterface = Jymfony.Component.Messenger.Retry.RetryStrategyInterface;
const SendFailedMessageForRetryListener = Jymfony.Component.Messenger.EventListener.SendFailedMessageForRetryListener;
const SenderInterface = Jymfony.Component.Messenger.Transport.Sender.SenderInterface;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;
const WorkerMessageRetriedEvent = Jymfony.Component.Messenger.Event.WorkerMessageRetriedEvent;

export default class SendFailedMessageForRetryListenerTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testNoRetryStrategyCausesNoRetry() {
        const senderLocator = this.prophesize(ContainerInterface);
        senderLocator.has(Argument.any()).shouldNotBeCalled();
        senderLocator.get(Argument.any()).shouldNotBeCalled();

        const retryStrategyLocator = this.prophesize(ContainerInterface);
        retryStrategyLocator.has(Argument.any()).shouldBeCalledTimes(1).willReturn(false);

        const listener = new SendFailedMessageForRetryListener(senderLocator.reveal(), retryStrategyLocator.reveal());

        const exception = new Exception('no!');
        const envelope = new Envelope({});
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', exception);

        await listener.onMessageFailed(event);
    }

    async testRecoverableStrategyCausesRetry() {
        const sender = this.prophesize(SenderInterface);
        sender.send(Argument.type(Envelope))
            .shouldBeCalledTimes(1)
            .will(envelope => {
                /** @type {Jymfony.Component.Messenger.Stamp.DelayStamp} delayStamp */
                const delayStamp = envelope.last(DelayStamp);
                /** @type {Jymfony.Component.Messenger.Stamp.RedeliveryStamp} redeliveryStamp */
                const redeliveryStamp = envelope.last(RedeliveryStamp);

                __self.assertInstanceOf(DelayStamp, delayStamp);
                __self.assertSame(1000, delayStamp.delay);

                __self.assertInstanceOf(RedeliveryStamp, redeliveryStamp);
                __self.assertSame(1, redeliveryStamp.retryCount);

                return envelope;
            });

        const senderLocator = this.prophesize(ContainerInterface);
        senderLocator.has(Argument.any()).willReturn(true);
        senderLocator.get(Argument.any()).willReturn(sender);

        const retryStategy = this.prophesize(RetryStrategyInterface);
        retryStategy.isRetryable(Argument.cetera()).shouldNotBeCalled();
        retryStategy.getWaitingTime(Argument.cetera()).shouldBeCalledTimes(1).willReturn(1000);

        const retryStrategyLocator = this.prophesize(ContainerInterface);
        retryStrategyLocator.has(Argument.any()).willReturn(true);
        retryStrategyLocator.get(Argument.any()).willReturn(retryStategy);

        const listener = new SendFailedMessageForRetryListener(senderLocator.reveal(), retryStrategyLocator.reveal());

        const exception = new RecoverableMessageHandlingException('retry');
        const envelope = new Envelope(new Envelope({}));
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', exception);

        await listener.onMessageFailed(event);
    }

    async testEnvelopeIsSentToTransportOnRetry() {
        const exception = new Exception('no!');
        const envelope = new Envelope({});

        const sender = this.prophesize(SenderInterface);
        sender.send(Argument.type(Envelope))
            .shouldBeCalledTimes(1)
            .will(envelope => {
                /** @type {Jymfony.Component.Messenger.Stamp.DelayStamp} delayStamp */
                const delayStamp = envelope.last(DelayStamp);
                /** @type {Jymfony.Component.Messenger.Stamp.RedeliveryStamp} redeliveryStamp */
                const redeliveryStamp = envelope.last(RedeliveryStamp);

                __self.assertInstanceOf(DelayStamp, delayStamp);
                __self.assertSame(1000, delayStamp.delay);

                __self.assertInstanceOf(RedeliveryStamp, redeliveryStamp);
                __self.assertSame(1, redeliveryStamp.retryCount);

                return envelope;
            });

        const senderLocator = this.prophesize(ContainerInterface);
        senderLocator.has(Argument.any()).willReturn(true);
        senderLocator.get(Argument.any()).willReturn(sender);

        const retryStategy = this.prophesize(RetryStrategyInterface);
        retryStategy.isRetryable(Argument.cetera()).shouldBeCalled().willReturn(true);
        retryStategy.getWaitingTime(Argument.cetera()).shouldBeCalledTimes(1).willReturn(1000);

        const retryStrategyLocator = this.prophesize(ContainerInterface);
        retryStrategyLocator.has(Argument.any()).willReturn(true);
        retryStrategyLocator.get(Argument.any()).willReturn(retryStategy);

        const eventDispatcher = this.prophesize(EventDispatcherInterface);
        eventDispatcher.dispatch(Argument.type(WorkerMessageRetriedEvent)).shouldBeCalledTimes(1);

        const listener = new SendFailedMessageForRetryListener(
            senderLocator.reveal(),
            retryStrategyLocator.reveal(),
            null,
            eventDispatcher.reveal()
        );

        await listener.onMessageFailed(new WorkerMessageFailedEvent(envelope, 'my_receiver', exception));
    }

    async testEnvelopeIsSentToTransportOnRetryWithExceptionPassedToRetryStrategy() {
        const exception = new Exception('no!');
        const envelope = new Envelope({});

        const sender = this.prophesize(SenderInterface);
        sender.send(Argument.type(Envelope))
            .shouldBeCalledTimes(1)
            .will(envelope => {
                /** @type {Jymfony.Component.Messenger.Stamp.DelayStamp} delayStamp */
                const delayStamp = envelope.last(DelayStamp);
                /** @type {Jymfony.Component.Messenger.Stamp.RedeliveryStamp} redeliveryStamp */
                const redeliveryStamp = envelope.last(RedeliveryStamp);

                __self.assertInstanceOf(DelayStamp, delayStamp);
                __self.assertSame(1000, delayStamp.delay);

                __self.assertInstanceOf(RedeliveryStamp, redeliveryStamp);
                __self.assertSame(1, redeliveryStamp.retryCount);

                return envelope;
            });

        const senderLocator = this.prophesize(ContainerInterface);
        senderLocator.has(Argument.any()).willReturn(true);
        senderLocator.get(Argument.any()).willReturn(sender);

        const retryStategy = this.prophesize(RetryStrategyInterface);
        retryStategy.isRetryable(envelope, exception).shouldBeCalled().willReturn(true);
        retryStategy.getWaitingTime(envelope, exception).shouldBeCalledTimes(1).willReturn(1000);

        const retryStrategyLocator = this.prophesize(ContainerInterface);
        retryStrategyLocator.has(Argument.any()).willReturn(true);
        retryStrategyLocator.get(Argument.any()).willReturn(retryStategy);

        const listener = new SendFailedMessageForRetryListener(senderLocator.reveal(), retryStrategyLocator.reveal());
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', exception);

        await listener.onMessageFailed(event);
    }

    async testEnvelopeKeepOnlyTheLast10Stamps() {
        const exception = new Exception('no!');
        const stamps = [
            ...new Array(15).fill(new DelayStamp(1)),
            ...new Array(3).fill(new RedeliveryStamp(1)),
        ];

        const envelope = new Envelope({}, stamps);

        const sender = this.prophesize(SenderInterface);
        sender.send(Argument.type(Envelope)).will(envelope => {
            const delayStamps = envelope.all(DelayStamp);
            const redeliveryStamps = envelope.all(RedeliveryStamp);

            __self.assertCount(10, delayStamps);
            __self.assertCount(4, redeliveryStamps);

            return envelope;
        });

        const senderLocator = this.prophesize(ContainerInterface);
        senderLocator.has(Argument.any()).willReturn(true);
        senderLocator.get(Argument.any()).willReturn(sender);

        const retryStategy = this.prophesize(RetryStrategyInterface);
        retryStategy.isRetryable(envelope, exception).shouldBeCalled().willReturn(true);
        retryStategy.getWaitingTime(envelope, exception).shouldBeCalledTimes(1).willReturn(1000);

        const retryStrategyLocator = this.prophesize(ContainerInterface);
        retryStrategyLocator.has(Argument.any()).willReturn(true);
        retryStrategyLocator.get(Argument.any()).willReturn(retryStategy);

        const listener = new SendFailedMessageForRetryListener(senderLocator.reveal(), retryStrategyLocator.reveal());
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', exception);

        await listener.onMessageFailed(event);
    }
}
