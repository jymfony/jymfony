declare namespace Jymfony.Component.Messenger.Transport.Serialization {
    import Envelope = Jymfony.Component.Messenger.Envelope;

    export class SerializerInterface {
        /**
         * Decodes an envelope and its message from an encoded-form.
         *
         * The `encodedEnvelope` parameter is a key-value array that
         * describes the envelope and its content, that will be used by the different transports.
         *
         * The most common keys are:
         * - `body` (string) - the message body
         * - `headers` (string<string>) - a key/value pair of headers
         *
         * @throws {Jymfony.Component.Messenger.Exception.MessageDecodingFailedException}
         */
        decode(encodedEnvelope: any): Envelope;

        /**
         * Encodes an envelope content (message & stamps) to a common format understandable by transports.
         * The encoded array should only contain scalars and arrays.
         *
         * Stamps that implement NonSendableStampInterface should
         * not be encoded.
         *
         * The most common keys of the encoded array are:
         * - `body` (string) - the message body
         * - `headers` (string<string>) - a key/value pair of headers
         */
        encode(envelope: Envelope): any;
    }
}
