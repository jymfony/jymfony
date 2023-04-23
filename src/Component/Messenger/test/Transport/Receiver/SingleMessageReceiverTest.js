const Envelope = Jymfony.Component.Messenger.Envelope;
const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;
const SingleMessageReceiver = Jymfony.Component.Messenger.Transport.Receiver.SingleMessageReceiver;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class SingleMessageReceiverTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    testItReceivesOnlyOneMessage() {
        const innerReceiver = this.prophesize(ReceiverInterface);
        const envelope = new Envelope({});

        const receiver = new SingleMessageReceiver(innerReceiver.reveal(), envelope);
        const received = receiver.get();

        __self.assertCount(1, received);
        __self.assertSame(received[0], envelope);

        __self.assertEmpty(receiver.get());
    }

    testCallsAreForwarded() {
        const envelope = new Envelope({});

        const innerReceiver = this.prophesize(ReceiverInterface);
        innerReceiver.ack(envelope).shouldBeCalled();
        innerReceiver.reject(envelope).shouldBeCalled();

        const receiver = new SingleMessageReceiver(innerReceiver.reveal(), envelope);
        receiver.ack(envelope);
        receiver.reject(envelope);
    }
}
