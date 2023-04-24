const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class DummyReceiver extends implementationOf(ReceiverInterface) {
    * get() {
        yield new Envelope(new DummyMessage('Dummy'));
    }

    stop() {
    }

    ack(envelope) {
    }

    reject(envelope) {
    }
}
