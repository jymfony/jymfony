const Argument = Jymfony.Component.Testing.Argument.Argument;
const Envelope = Jymfony.Component.Messenger.Envelope;
const SendFailedMessageToFailureTransportListener = Jymfony.Component.Messenger.EventListener.SendFailedMessageToFailureTransportListener;
const SentToFailureTransportStamp = Jymfony.Component.Messenger.Stamp.SentToFailureTransportStamp;
const SenderInterface = Jymfony.Component.Messenger.Transport.Sender.SenderInterface;
const ServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;

export default class SendFailedMessageToFailureTransportListenerTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testItSendsToTheFailureTransportWithSenderLocator() {
        const receiverName = 'my_receiver';
        const sender = this.prophesize(SenderInterface);
        sender.send(Argument.that(envelope => {
            /* @var Envelope $envelope */
            __self.assertInstanceOf(Envelope, envelope);

            const sentToFailureTransportStamp = envelope.last(SentToFailureTransportStamp);
            __self.assertNotNull(sentToFailureTransportStamp);
            __self.assertSame(receiverName, sentToFailureTransportStamp.originalReceiverName);

            return true;
        })).willReturnArgument(0);

        const serviceLocator = this.prophesize(ServiceLocator);
        serviceLocator.has(Argument.any()).willReturn(true);
        serviceLocator.get(receiverName).willReturn(sender);
        const listener = new SendFailedMessageToFailureTransportListener(serviceLocator.reveal());

        const exception = new Exception('no!');
        const envelope = new Envelope({});
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', exception);

        await listener.onMessageFailed(event);
    }

    async testDoNothingOnRetryWithServiceLocator() {
        const sender = this.prophesize(SenderInterface);
        sender.send(Argument.any()).shouldNotBeCalled();

        const serviceLocator = this.prophesize(ServiceLocator);
        const listener = new SendFailedMessageToFailureTransportListener(serviceLocator.reveal());

        const envelope = new Envelope({});
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', new Exception());
        event.setForRetry();

        await listener.onMessageFailed(event);
    }

    async testDoNotRedeliverToFailedWithServiceLocator() {
        const receiverName = 'my_receiver';

        const sender = this.prophesize(SenderInterface);
        sender.send(Argument.any()).shouldNotBeCalled();
        const serviceLocator = this.prophesize(ServiceLocator);

        const listener = new SendFailedMessageToFailureTransportListener(serviceLocator.reveal());
        const envelope = new Envelope({}, [
            new SentToFailureTransportStamp(receiverName),
        ]);

        const event = new WorkerMessageFailedEvent(envelope, receiverName, new Exception());

        await listener.onMessageFailed(event);
    }

    async testDoNothingIfFailureTransportIsNotDefined() {
        const sender = this.prophesize(SenderInterface);
        sender.send(Argument.any()).shouldNotBeCalled();

        const serviceLocator = this.prophesize(ServiceLocator);
        const listener = new SendFailedMessageToFailureTransportListener(serviceLocator.reveal(), null);

        const exception = new Exception('no!');
        const envelope = new Envelope({});
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', exception);

        await listener.onMessageFailed(event);
    }

    async testItSendsToTheFailureTransportWithMultipleFailedTransports() {
        const receiverName = 'my_receiver';
        const sender = this.prophesize(SenderInterface);
        sender.send(Argument.that(envelope => {
            __self.assertInstanceOf(Envelope, envelope);

            const sentToFailureTransportStamp = envelope.last(SentToFailureTransportStamp);
            __self.assertNotNull(sentToFailureTransportStamp);
            __self.assertSame(receiverName, sentToFailureTransportStamp.originalReceiverName);

            return true;
        })).willReturnArgument(0);

        const serviceLocator = this.prophesize(ServiceLocator);
        serviceLocator.has(receiverName).willReturn(true);
        serviceLocator.get(receiverName).willReturn(sender);

        const listener = new SendFailedMessageToFailureTransportListener(serviceLocator.reveal());

        const exception = new Exception('no!');
        const envelope = new Envelope({});
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', exception);

        await listener.onMessageFailed(event);
    }
}
