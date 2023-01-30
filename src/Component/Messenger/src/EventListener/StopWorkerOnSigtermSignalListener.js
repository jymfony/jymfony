const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const WorkerStartedEvent = Jymfony.Component.Messenger.Event.WorkerStartedEvent;

/**
 * @memberOf Jymfony.Component.Messenger.EventListener
 */
export default class StopWorkerOnSigtermSignalListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger = null]
     */
    __construct(logger = null) {
        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();
    }

    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerStartedEvent} event
     */
    onWorkerStarted(event) {
        process.on('SIGTERM', () => {
            this._logger.info('Received SIGTERM signal.', { transport_names: event.worker.metadata.transportNames });
            event.worker.stop();
        });
    }

    static getSubscribedEvents() {
        return {
            [ReflectionClass.getClassName(WorkerStartedEvent)]: [ 'onWorkerStarted', 100 ],
        };
    }
}
