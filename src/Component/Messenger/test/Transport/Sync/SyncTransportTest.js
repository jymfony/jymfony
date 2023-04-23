const Argument = Jymfony.Component.Testing.Argument.Argument;
const Envelope = Jymfony.Component.Messenger.Envelope;
const MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;
const ReceivedStamp = Jymfony.Component.Messenger.Stamp.ReceivedStamp;
const SyncTransport = Jymfony.Component.Messenger.Transport.Sync.SyncTransport;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class SyncTransportTest extends TestCase {
    async testSend() {
        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.type(Envelope)).willReturnArgument(0);

        const message = {};
        let envelope = new Envelope(message);
        const transport = new SyncTransport(bus.reveal());
        envelope = await transport.send(envelope);

        __self.assertSame(message, envelope.message);
        __self.assertNotNull(envelope.last(ReceivedStamp));
    }
}
