const Envelope = Jymfony.Component.Messenger.Envelope;
const MessageDecodingFailedException = Jymfony.Component.Messenger.Exception.MessageDecodingFailedException;
const MessageDecodingFailedStamp = Jymfony.Component.Messenger.Stamp.MessageDecodingFailedStamp;
const NonSendableStampInterface = Jymfony.Component.Messenger.Stamp.NonSendableStampInterface;
const SerializerInterface = Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Transport.Serialization
 */
export default class NativeSerializer extends implementationOf(SerializerInterface) {
    __construct() {
        /**
         * @type {boolean}
         *
         * @private
         */
        this._acceptIncompleteClass = false;
    }

    /**
     * @internal
     */
    acceptIncompleteClass() {
        this._acceptIncompleteClass = true;
    }

    /**
     * @internal
     */
    rejectIncompleteClass() {
        this._acceptIncompleteClass = false;
    }

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
            .toString()
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


        let envelope;
        try {
            envelope = __jymfony.unserialize(serializeEnvelope, { throwOnInvalidClass: ! this._acceptIncompleteClass });
        } catch (e) {
            throw new MessageDecodingFailedException(__jymfony.sprintf(
                'Could not decode message using serialization: %s.',
                e.message.includes('Unknown or disallowed class') ? e.message : serializeEnvelope
            ), 0, e);
        }

        if (! (envelope instanceof Envelope)) {
            throw new MessageDecodingFailedException(__jymfony.sprintf('Could not decode message using serialization: %s.', serializeEnvelope));
        }

        if (envelope.message && '__Incomplete_Class' === envelope.message.constructor.name) {
            envelope = envelope.withStamps(new MessageDecodingFailedStamp());
        }

        return envelope;
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
