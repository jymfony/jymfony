const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const MessageDecodingFailedException = Jymfony.Component.Messenger.Exception.MessageDecodingFailedException;
const NativeSerializer = Jymfony.Component.Messenger.Transport.Serialization.NativeSerializer;
const NonSendableStamp = Jymfony.Component.Messenger.Fixtures.NonSendableStamp;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class NativeSerializerTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    testEncodedIsDecodable() {
        const serializer = this.createSerializer();
        const envelope = new Envelope(new DummyMessage('Hello'));

        const encoded = serializer.encode(envelope);
        __self.assertStringNotContainsString('\0', encoded.body, 'Does not contain the binary characters');
        __self.assertEquals(envelope, serializer.decode(encoded));
    }

    testDecodingFailsWithMissingBodyKey() {
        this.expectException(MessageDecodingFailedException);
        this.expectExceptionMessage('Encoded envelope should have at least a "body", or maybe you should implement your own serializer.');

        const serializer = this.createSerializer();
        serializer.decode({});
    }

    testDecodingFailsWithBadFormat() {
        this.expectException(MessageDecodingFailedException);
        this.expectExceptionMessageRegex(/Could not decode/);

        const serializer = this.createSerializer();
        serializer.decode({
            body: '{"message": "bar"}',
        });
    }

    testDecodingFailsWithBadBase64Body() {
        this.expectException(MessageDecodingFailedException);
        this.expectExceptionMessageRegex(/Could not decode/);

        const serializer = this.createSerializer();
        serializer.decode({
            body: 'x',
        });
    }

    testDecodingFailsWithBadClass() {
        this.expectException(MessageDecodingFailedException);
        this.expectExceptionMessageRegex(/Unknown or disallowed class ReceivedSt0mp\./);

        const serializer = this.createSerializer();
        serializer.decode({
            body: 'C[ReceivedSt0mp](0):{}',
        });
    }

    testEncodedSkipsNonEncodeableStamps() {
        const serializer = this.createSerializer();
        const envelope = new Envelope(new DummyMessage('Hello'), [
            new NonSendableStamp(),
        ]);

        const encoded = serializer.encode(envelope);
        const encodedBody = Buffer.from(encoded.body, 'base64').toString();
        __self.assertStringNotContainsString('NonSendableStamp', encodedBody);
    }

    createSerializer() {
        return new NativeSerializer();
    }
}
