const Argument = Jymfony.Component.Testing.Argument.Argument;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const InMemoryTransport = Jymfony.Component.Messenger.Transport.InMemory.InMemoryTransport;
const InMemoryTransportFactory = Jymfony.Component.Messenger.Transport.InMemory.InMemoryTransportFactory;
const SerializerInterface = Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TransportMessageIdStamp = Jymfony.Component.Messenger.Stamp.TransportMessageIdStamp;

export default class InMemoryTransportFactoryTest extends TestCase {
    /**
     * @type {Jymfony.Component.Messenger.Transport.InMemory.InMemoryTransportFactory}
     * @private
     */
    _factory;

    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    beforeEach() {
        this._factory = new InMemoryTransportFactory();
    }

    @dataProvider('provideDSN')
    testSupports(dsn, expected = true) {
        __self.assertEquals(expected, this._factory.supports(dsn), 'InMemoryTransportFactory.supports returned unexpected result.');
    }

    async testCreateTransport() {
        const serializer = this.prophesize(SerializerInterface);
        __self.assertInstanceOf(InMemoryTransport, await this._factory.createTransport('in-memory://', [], serializer.reveal()));
    }

    async testCreateTransportWithoutSerializer() {
        const serializer = this.prophesize(SerializerInterface);
        serializer.encode(Argument.cetera()).shouldNotBeCalled();
        const transport = await this._factory.createTransport('in-memory://?serialize=false', [], serializer.reveal());

        const message = Envelope.wrap(new DummyMessage('Hello.'));
        await transport.send(message);

        __self.assertEquals([ message.withStamps(new TransportMessageIdStamp(1)) ], await transport.get());
    }

    async testCreateTransportWithSerializer() {
        const serializer = this.prophesize(SerializerInterface);
        const message = Envelope.wrap(new DummyMessage('Hello.'));

        serializer.encode(message.withStamps(new TransportMessageIdStamp(1)))
            .shouldBeCalledTimes(1);

        const transport = await this._factory.createTransport('in-memory://?serialize=true', [], serializer.reveal());
        await transport.send(message);
    }

    provideDSN() {
        return [
            [ 'in-memory://foo' ],
            [ 'in-memory://?serialize=true' ],
            [ 'in-memory://?serialize=false' ],
            [ 'amqp://bar', false ],
        ];
    }
}
