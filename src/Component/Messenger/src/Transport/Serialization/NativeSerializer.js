const MessageDecodingFailedException = Jymfony.Component.Messenger.Exception.MessageDecodingFailedException;
const NonSendableStampInterface = Jymfony.Component.Messenger.Stamp.NonSendableStampInterface;
const SerializerInterface = Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Transport.Serialization
 */
export default class NativeSerializer extends implementationOf(SerializerInterface) {
    /**
     * @inheritdoc
     */
    decode(encodedEnvelope) {
        if (! encodedEnvelope.body) {
            throw new MessageDecodingFailedException('Encoded envelope should have at least a "body", or maybe you should implement your own serializer.');
        }

        __assert(isString(encodedEnvelope.body));
        if (! encodedEnvelope.body.endsWith('}')) {
            encodedEnvelope.body = Buffer.from(encodedEnvelope.body, 'base64');
        }

        const serializeEnvelope = encodedEnvelope.body
            .replace(/\\(.?)/g, (s, n1) => {
                switch (n1) {
                    case '\\':
                        return '\\';
                    case '0':
                        return '\u0000';
                    case '':
                        return '';
                    default:
                        return n1;
                }
            });


        try {
            return __jymfony.unserialize(serializeEnvelope);
        } catch (e) {
            throw new MessageDecodingFailedException(__jymfony.sprintf('Could not decode message using serialization: %s.', serializeEnvelope), 0, e);
        }
    }

    /**
     * @inheritdoc
     */
    encode(envelope) {
        envelope = envelope.withoutStampsOfType(NonSendableStampInterface);
        const body = __jymfony.serialize(envelope)
            .replace(/[\\"']/g, '\\$&')
            .replace(/\u0000/g, '\\0');

        return {
            body: Buffer.from(body).toString('base64'),
        };
    }
}
