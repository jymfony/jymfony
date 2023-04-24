const AnEnvelopeStamp = Jymfony.Component.Messenger.Fixtures.AnEnvelopeStamp;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const DelayStamp = Jymfony.Component.Messenger.Stamp.DelayStamp;
const Envelope = Jymfony.Component.Messenger.Envelope;
const InMemoryTransport = Jymfony.Component.Messenger.Transport.InMemory.InMemoryTransport;
const SerializerInterface = Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TransportMessageIdStamp = Jymfony.Component.Messenger.Stamp.TransportMessageIdStamp;

export default class InMemoryTransportTest extends TestCase {
    /**
     * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy|Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface}
     * @private
     */
    _serializer;

    /**
     * @type {Jymfony.Component.Messenger.Transport.InMemory.InMemoryTransport}
     * @private
     */
    _transport;

    /**
     * @type {Jymfony.Component.Messenger.Transport.InMemory.InMemoryTransport}
     * @private
     */
    _serializeTransport;

    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

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

    async testSendWithSerialization() {
        const envelope = new Envelope({});
        const envelopeDecoded = Envelope.wrap(new DummyMessage('Hello.'));

        this._serializer
            .encode(envelope.withStamps(new TransportMessageIdStamp(1)))
            .willReturn({ foo: 'ba' });
        this._serializer
            .decode({ foo: 'ba' }, 0, Argument.any())
            .willReturn(envelopeDecoded);

        await this._serializeTransport.send(envelope);
        __self.assertSame([ envelopeDecoded ], this._serializeTransport.sent);
    }

    async testQueue() {
        let envelope1 = new Envelope({});
        envelope1 = await this._transport.send(envelope1);
        let envelope2 = new Envelope({});
        envelope2 = await this._transport.send(envelope1);

        __self.assertEquals([ envelope1, envelope2 ], await this._transport.get());
        await this._transport.ack(envelope1);
        __self.assertEquals([ envelope2 ], await this._transport.get());
        await this._transport.reject(envelope2);
        __self.assertEquals([], await this._transport.get());
    }

    @timeSensitive()
    async testQueueWithDelay() {
        let envelope1 = new Envelope({});
        envelope1 = await this._transport.send(envelope1);
        let envelope2 = (new Envelope({})).withStamps(new DelayStamp(10000));
        envelope2 = await this._transport.send(envelope2);
        __self.assertEquals([ envelope1 ], await this._transport.get());

        await __jymfony.sleep(10001);
        __self.assertEquals([ envelope1, envelope2 ], await this._transport.get());
    }

    async testQueueWithSerialization() {
        const envelope = new Envelope({});
        const envelopeDecoded = Envelope.wrap(new DummyMessage('Hello.'));

        this._serializer
            .encode(envelope.withStamps(new TransportMessageIdStamp(1)))
            .willReturn({ foo: 'ba' });
        this._serializer
            .decode({ foo: 'ba' }, 0, Argument.any())
            .willReturn(envelopeDecoded);

        await this._serializeTransport.send(envelope);
        __self.assertEquals([ envelopeDecoded ], await this._serializeTransport.get());
    }

    async testAcknowledgeSameMessageWithDifferentStamps() {
        let envelope1 = new Envelope({}, [ new AnEnvelopeStamp() ]);
        envelope1 = await this._transport.send(envelope1);
        let envelope2 = new Envelope({}, [ new AnEnvelopeStamp() ]);
        envelope2 = await this._transport.send(envelope2);

        __self.assertEquals([ envelope1, envelope2 ], await this._transport.get());
        await this._transport.ack(envelope1.withStamps(new AnEnvelopeStamp()));
        __self.assertEquals([ envelope2 ], await this._transport.get());
        await this._transport.ack(envelope2.withStamps(new AnEnvelopeStamp()));
        __self.assertEquals([], await this._transport.get());
    }

    async testAck() {
        let envelope = new Envelope({});
        envelope = await this._transport.send(envelope);
        await this._transport.ack(envelope);

        __self.assertEquals([ envelope ], this._transport.acknowledged);
    }

    async testAckWithSerialization() {
        const envelope = new Envelope({});
        const envelopeDecoded = Envelope.wrap(new DummyMessage('Hello.'));

        this._serializer
            .encode(envelope.withStamps(new TransportMessageIdStamp(1)))
            .willReturn({ foo: 'ba' });
        this._serializer
            .decode({ foo: 'ba' }, 0, Argument.any())
            .willReturn(envelopeDecoded);

        await this._serializeTransport.ack(envelope.withStamps(new TransportMessageIdStamp(1)));
        __self.assertEquals([ envelopeDecoded ], this._serializeTransport.acknowledged);
    }

    async testReject() {
        let envelope = new Envelope({});
        envelope = await this._transport.send(envelope);

        await this._transport.reject(envelope);
        __self.assertEquals([ envelope ], this._transport.rejected);
    }

    async testRejectWithSerialization() {
        const envelope = new Envelope({});
        const envelopeDecoded = Envelope.wrap(new DummyMessage('Hello.'));

        this._serializer.encode(envelope.withStamps(new TransportMessageIdStamp(1)))
            .willReturn({ foo: 'ba' });

        this._serializer
            .decode({ foo: 'ba' }, 0, Argument.any())
            .willReturn(envelopeDecoded);

        await this._serializeTransport.reject(envelope.withStamps(new TransportMessageIdStamp(1)));
        __self.assertEquals([ envelopeDecoded ], this._serializeTransport.rejected);
    }
}
