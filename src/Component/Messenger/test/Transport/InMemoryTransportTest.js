const Envelope = Jymfony.Component.Messenger.Envelope;
const InMemoryTransport = Jymfony.Component.Messenger.Transport.InMemoryTransport;
const SerializerInterface = Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TransportMessageIdStamp = Jymfony.Component.Messenger.Stamp.TransportMessageIdStamp;

/**
 * @author Gary PEGEOT <garypegeot@gmail.com>
 */
export default class InMemoryTransportTest extends TestCase {
    _serializer;
    _transport;
    _serializeTransport;

    beforeEach() {
        this._serializer = this.prophesize(SerializerInterface);
        this._transport = new InMemoryTransport();
        this._serializeTransport = new InMemoryTransport(this._serializer.reveal());
    }

    async testSend() {
        const envelope = new Envelope({});
        await this._transport.send(envelope);

        __self.assertEquals([ envelope.withStamps(new TransportMessageIdStamp(1)) ], this._transport.sent);
    }
}
