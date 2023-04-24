const MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;
const SerializerInterface = Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface;
const SyncTransport = Jymfony.Component.Messenger.Transport.Sync.SyncTransport;
const SyncTransportFactory = Jymfony.Component.Messenger.Transport.Sync.SyncTransportFactory;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class SyncTransportFactoryTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testCreateTransport() {
        const serializer = this.prophesize(SerializerInterface);
        const bus = this.prophesize(MessageBusInterface);

        const factory = new SyncTransportFactory(bus.reveal());
        const transport = await factory.createTransport('sync://', {}, serializer.reveal());

        __self.assertInstanceOf(SyncTransport, transport);
    }
}
