const AckStamp = Jymfony.Component.Messenger.Stamp.AckStamp;
const ConsumedByWorkerStamp = Jymfony.Component.Messenger.Stamp.ConsumedByWorkerStamp;
const DateTime = Jymfony.Component.DateTime.DateTime;
const FlushBatchHandlersStamp = Jymfony.Component.Messenger.Stamp.FlushBatchHandlersStamp;
const HandlerFailedException = Jymfony.Component.Messenger.Exception.HandlerFailedException;
const NoAutoAckStamp = Jymfony.Component.Messenger.Stamp.NoAutoAckStamp;
const QueueReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.QueueReceiverInterface;
const ReceivedStamp = Jymfony.Component.Messenger.Stamp.ReceivedStamp;
const RejectRedeliveredMessageException = Jymfony.Component.Messenger.Exception.RejectRedeliveredMessageException;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;
const WorkerMessageHandledEvent = Jymfony.Component.Messenger.Event.WorkerMessageHandledEvent;
const WorkerMessageReceivedEvent = Jymfony.Component.Messenger.Event.WorkerMessageReceivedEvent;
const WorkerMetadata = Jymfony.Component.Messenger.WorkerMetadata;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;
const WorkerStartedEvent = Jymfony.Component.Messenger.Event.WorkerStartedEvent;
const WorkerStoppedEvent = Jymfony.Component.Messenger.Event.WorkerStoppedEvent;

/**
 * @memberOf Jymfony.Component.Messenger
 *
 * @final
 */
export default class Worker {
    /**
     * Constructor.
     *
     * @param {Object.<string, Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface>} receivers Where the key is the transport name
     * @param {Jymfony.Component.Messenger.MessageBusInterface} bus
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} [eventDispatcher = null]
     * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger = null]
     */
    __construct(receivers, bus, eventDispatcher = null, logger = null) {
        /**
         * @type {Object<string, Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface>}
         *
         * @private
         */
        this._receivers = receivers;

        /**
         * @type {Jymfony.Component.Messenger.MessageBusInterface}
         *
         * @private
         */
        this._bus = bus;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger;

        /**
         * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
         *
         * @private
         */
        this._eventDispatcher = eventDispatcher;

        /**
         * @type {Jymfony.Component.Messenger.WorkerMetadata}
         *
         * @private
         */
        this._metadata = new WorkerMetadata({
            transportNames: Object.keys(receivers),
        });

        /**
         * @type {*[]}
         *
         * @private
         */
        this._acks = [];

        /**
         * @type {Map<any, any>}
         *
         * @private
         */
        this._unacks = new Map();

        /**
         * @type {boolean}
         *
         * @private
         */
        this._shouldStop = false;
    }

    /**
     * Receive the messages and dispatch them to the bus.
     *
     * Valid options are:
     *  * sleep (default: 1000000): Time in microseconds to sleep after no messages are found
     *  * queues: The queue names to consume from, instead of consuming from all queues. When this is used, all receivers must implement the QueueReceiverInterface
     */
    async run(options = {}) {
        options = {
            sleep: 1000000,
            ...options,
        };

        const queueNames = options.queues || null;
        this._metadata.set({ queueNames });

        await this._dispatchEvent(new WorkerStartedEvent(this));

        if (queueNames) {
            // If queue names are specified, all receivers must implement the QueueReceiverInterface
            for (const [ transportName, receiver ] of __jymfony.getEntries(this._receivers)) {
                if (! (receiver instanceof QueueReceiverInterface)) {
                    throw new RuntimeException(__jymfony.sprintf('Receiver for "%s" does not implement "%s".', transportName, ReflectionClass.getClassName(QueueReceiverInterface)));
                }
            }
        }

        while (! this._shouldStop) {
            let envelopeHandled = false;
            const envelopeHandledStart = DateTime.now.microtime;
            receiverLoop: for (const [ transportName, receiver ] of __jymfony.getEntries(this._receivers)) {
                const envelopes = await (async () => {
                    if (queueNames) {
                        return receiver.getFromQueues(queueNames);
                    }

                    return receiver.get();
                })();

                for (const envelope of envelopes) {
                    envelopeHandled = true;

                    await this._handleMessage(envelope, transportName);
                    await this._dispatchEvent(new WorkerRunningEvent(this, false));

                    if (this._shouldStop) {
                        break receiverLoop;
                    }
                }

                // After handling a single receiver, quit and start the loop again
                // This should prevent multiple lower priority receivers from
                // Blocking too long before the higher priority are checked
                if (envelopeHandled) {
                    break;
                }
            }

            if (!envelopeHandled && await this._flush(false)) {
                continue;
            }

            if (!envelopeHandled) {
                await this._dispatchEvent(new WorkerRunningEvent(this, true));

                const sleep = options.sleep - 1e6 * (DateTime.now.microtime - envelopeHandledStart);
                if (0 < sleep) {
                    await __jymfony.sleep(sleep / 1000);
                }
            }
        }

        await this._flush(true);
        await this._dispatchEvent(new WorkerStoppedEvent(this));
    }

    /**
     * Handle queue message.
     *
     * @param {Jymfony.Component.Messenger.Envelope} envelope
     * @param {string} transportName
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _handleMessage(envelope, transportName) {
        const event = new WorkerMessageReceivedEvent(envelope, transportName);
        await this._dispatchEvent(event);
        envelope = event.envelope;

        if (! event.shouldHandle()) {
            return;
        }

        let acked = false;
        const ack = (envelope, e = null) => {
            acked = true;
            this._acks.push([ transportName, envelope, e ]);
        };

        let e = null;
        try {
            envelope = await this._bus.dispatch(envelope.withStamps(new ReceivedStamp(transportName), new ConsumedByWorkerStamp(), new AckStamp(ack)));
        } catch (t) {
            e = t;
        }

        /** @type {Jymfony.Component.Messenger.Stamp.NoAutoAckStamp|null} */
        const noAutoAckStamp = envelope.last(NoAutoAckStamp);

        if (!acked && !noAutoAckStamp) {
            this._acks.push([ transportName, envelope, e ]);
        } else if (noAutoAckStamp) {
            this._unacks.set(noAutoAckStamp.handlerDescriptor.batchHandler, [ envelope.withoutAllStamps(AckStamp), transportName ]);
        }

        await this.ack();
    }

    /**
     * @returns {Promise<boolean>}
     */
    async ack() {
        const acks = this._acks;
        this._acks = [];

        for (let [ transportName, envelope, e ] of acks) {
            const receiver = this._receivers[transportName];

            if (null !== e) {
                const rejectFirst = e instanceof RejectRedeliveredMessageException;
                if (rejectFirst) {
                    // Redelivered messages are rejected first so that continuous failures in an event listener or while
                    // Publishing for retry does not cause infinite redelivery loops
                    await receiver.reject(envelope);
                }

                if (e instanceof HandlerFailedException) {
                    envelope = e.envelope;
                }

                const failedEvent = new WorkerMessageFailedEvent(envelope, transportName, e);

                await this._dispatchEvent(failedEvent);
                envelope = failedEvent.envelope;

                if (!rejectFirst) {
                    await receiver.reject(envelope);
                }

                continue;
            }

            const handledEvent = new WorkerMessageHandledEvent(envelope, transportName);
            await this._dispatchEvent(handledEvent);
            envelope = handledEvent.envelope;

            if (null !== this._logger) {
                const message = envelope.message;
                const context = {
                    class: ReflectionClass.getClassName(message),
                };
                this._logger.info('{class} was handled successfully (acknowledging to transport).', context);
            }

            await receiver.ack(envelope);
        }

        return !! acks;
    }

    /**
     * @param {boolean} force
     *
     * @returns {Promise<boolean>}
     *
     * @private
     */
    async _flush(force) {
        const unacks = this._unacks;

        if (0 === unacks.size) {
            return false;
        }

        this._unacks = new Map();

        for (const batchHandler of unacks.keys()) {
            let [ envelope, transportName ] = unacks.get(batchHandler);

            try {
                await this._bus.dispatch(envelope.withStamps(new FlushBatchHandlersStamp(force)));
                envelope = envelope.withoutAllStamps(NoAutoAckStamp);

                unacks.delete(batchHandler);
            } catch (e) {
                this._acks.push([ transportName, envelope, e ]);
            }
        }

        return await this.ack();
    }

    stop() {
        if (null !== this._logger) {
            this._logger.info('Stopping worker.', { transport_names: this._metadata.transportNames });
        }

        this._shouldStop = true;
    }

    get metadata() {
        return this._metadata;
    }

    async _dispatchEvent(event) {
        if (null === this._eventDispatcher) {
            return;
        }

        await this._eventDispatcher.dispatch(event);
    }
}
