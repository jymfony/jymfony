/**
 * @memberOf Jymfony.Component.Messenger.Transport.Serialization
 */
class SerializerInterface {
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
     * @param {*} encodedEnvelope
     *
     * @returns {Jymfony.Component.Messenger.Envelope}
     *
     * @throws {Jymfony.Component.Messenger.Exception.MessageDecodingFailedException}
     */
    decode(encodedEnvelope) { }

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
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     *
     * @returns {*}
     */
    encode(envelope) { }
}

export default getInterface(SerializerInterface);
