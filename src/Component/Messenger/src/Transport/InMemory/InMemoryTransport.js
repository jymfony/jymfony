const DateTime = Jymfony.Component.DateTime.DateTime;
const DelayStamp = Jymfony.Component.Messenger.Stamp.DelayStamp;
const LogicException = Jymfony.Component.Messenger.Exception.LogicException;
const TransportInterface = Jymfony.Component.Messenger.Transport.TransportInterface;
const TransportMessageIdStamp = Jymfony.Component.Messenger.Stamp.TransportMessageIdStamp;

/**
 * Transport that stays in memory. Useful for testing purpose.
 *
 * @memberOf Jymfony.Component.Messenger.Transport.InMemory
 */
export default class InMemoryTransport extends implementationOf(TransportInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface | null} [serializer = null]
     */
    __construct(serializer = null) {
        /**
         * @type {Jymfony.Component.Messenger.Envelope[]}
         *
         * @private
         */
        this._sent = [];

        /**
         * @type {Jymfony.Component.Messenger.Envelope[]}
         *
         * @private
         */
        this._acknowledged = [];

        /**
         * @type {Jymfony.Component.Messenger.Envelope[]}
         *
         * @private
         */
        this._rejected = [];

        /**
         * @type {Map.<*, Jymfony.Component.Messenger.Envelope>}
         *
         * @private
         */
        this._queue = new Map();

        /**
         * @type {Map.<*, float>}
         *
         * @private
         */
        this._availableAt = new Map();

        /**
         * @type {int}
         *
         * @private
         */
        this._nextId = 1;

        /**
         * @type {Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface|null}
         *
         * @private
         */
        this._serializer = serializer;
    }

    /**
     * @inheritdoc
     */
    async get() {
        const envelopes = [];
        const now = DateTime.now;

        for (const [ id, envelope ] of this._queue.entries()) {
            if (!this._availableAt.has(id) || now.microtime >= this._availableAt.get(id)) {
                envelopes.push(...this._decode([ envelope ]));
            }
        }

        return envelopes;
    }

    /**
     * @inheritdoc
     */
    async ack(envelope) {
        this._acknowledged.push(this._encode(envelope));

        const transportMessageIdStamp = envelope.last(TransportMessageIdStamp);
        if (!transportMessageIdStamp) {
            throw new LogicException('No TransportMessageIdStamp found on the Envelope.');
        }

        this._queue.delete(transportMessageIdStamp.id);
        this._availableAt.delete(transportMessageIdStamp.id);
    }

    /**
     * @inheritdoc
     */
    async reject(envelope) {
        this._rejected.push(this._encode(envelope));

        const transportMessageIdStamp = envelope.last(TransportMessageIdStamp);
        if (!transportMessageIdStamp) {
            throw new LogicException('No TransportMessageIdStamp found on the Envelope.');
        }

        this._queue.delete(transportMessageIdStamp.id);
        this._availableAt.delete(transportMessageIdStamp.id);
    }

    /**
     * @inheritdoc
     */
    async send(envelope) {
        const id = this._nextId++;
        envelope = envelope.withStamps(new TransportMessageIdStamp(id));
        const encodedEnvelope = this._encode(envelope);
        this._sent.push(encodedEnvelope);
        this._queue.set(id, encodedEnvelope);

        const delayStamp = envelope.last(DelayStamp);
        if (null !== delayStamp) {
            const now = new DateTime();
            this._availableAt.set(id, now.microtime + delayStamp.delay / 1000);
        }

        return envelope;
    }

    /**
     * @returns {Jymfony.Component.Messenger.Envelope[]}
     */
    get acknowledged() {
        return this._decode(this._acknowledged);
    }

    /**
     * @returns {Jymfony.Component.Messenger.Envelope[]}
     */
    get rejected() {
        return this._decode(this._rejected);
    }

    /**
     * @returns {Jymfony.Component.Messenger.Envelope[]}
     */
    get sent() {
        return this._decode(this._sent);
    }

    /**
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     *
     * @returns {*}
     *
     * @private
     */
    _encode(envelope) {
        if (null === this._serializer) {
            return envelope;
        }

        return this._serializer.encode(envelope);
    }

    /**
     * @param {*[]} messagesEncoded
     *
     * @returns {Jymfony.Component.Messenger.Envelope[]}
     *
     * @private
     */
    _decode(messagesEncoded) {
        if (null === this._serializer) {
            return messagesEncoded;
        }

        return messagesEncoded.map(this._serializer.decode.bind(this._serializer));
    }
}
