const Envelope = Jymfony.Component.Messenger.Envelope;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const MessageDecodingFailedStamp = Jymfony.Component.Messenger.Stamp.MessageDecodingFailedStamp;
const NativeSerializer = Jymfony.Component.Messenger.Transport.Serialization.NativeSerializer;
const NativeSerializerTest = Jymfony.Component.Messenger.Tests.Transport.Serialization.NativeSerializerTest;
const MessageDecodingFailedException = Jymfony.Component.Messenger.Exception.MessageDecodingFailedException;
const VarDumperTestTrait = Jymfony.Component.VarDumper.Test.VarDumperTestTrait;

export default class NativeSerializerWithClassNotFoundSupportTest extends mix(NativeSerializerTest, VarDumperTestTrait) {
    testDecodingFailsWithBadClass() {
        this.expectException(MessageDecodingFailedException);
        const serializer = this.createSerializer();

        serializer.decode({
            body: 'C[ReceivedSt0mp]:0:{}',
        });
    }

    testDecodingFailsButCreateClassNotFound() {
        const serializer = this.createSerializer();

        const encodedEnvelope = serializer.encode(new Envelope(new DummyMessage('Hello')));
        // Simulate a change in the code base
        encodedEnvelope.body = Buffer.from(encodedEnvelope.body, 'base64').toString().replace('DummyMessage', 'OupsyMessage');

        const envelope = serializer.decode(encodedEnvelope);

        const lastMessageDecodingFailedStamp = envelope.last(MessageDecodingFailedStamp);
        this.assertInstanceOf(MessageDecodingFailedStamp, lastMessageDecodingFailedStamp);

        const message = envelope.message;

        this.assertDumpEquals(`__Incomplete_Class {
  +"__Class_Name": "Jymfony.Component.Messenger.Fixtures.OupsyMessage"
  +"_message": "Hello"
}
`, message);
    }

    createSerializer() {
        const serializer = new NativeSerializer();
        serializer.acceptIncompleteClass();

        return serializer;
    }
}
