declare namespace Jymfony.Component.Messenger.Transport.Serialization {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    export class NativeSerializer extends implementationOf(SerializerInterface) {
        /**
         * @inheritdoc
         */
        decode(encodedEnvelope: any): Envelope;

        /**
         * @inheritdoc
         */
        encode(envelope: Envelope): any;
    }
}
