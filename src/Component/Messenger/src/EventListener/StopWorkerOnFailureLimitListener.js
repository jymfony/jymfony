const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

/**
 * @memberOf Jymfony.Component.Messenger.EventListener
 */
export default class StopWorkerOnFailureLimitListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {int} maximumNumberOfFailures
     * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger = null]
     */
    __construct(maximumNumberOfFailures, logger = null) {
        /**
         * @type {int}
         *
         * @private
         */
        this._maximumNumberOfFailures = maximumNumberOfFailures;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        /**
         * @type {int}
         *
         * @private
         */
        this._failedMessages = 0;

        if (0 >= maximumNumberOfFailures) {
            throw new InvalidArgumentException('Failure limit must be greater than zero.');
        }
    }

    onMessageFailed() {
        ++this._failedMessages;
    }

    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerRunningEvent} event
     */
    onWorkerRunning(event) {
        if (! event.isWorkerIdle && this._failedMessages >= this._maximumNumberOfFailures) {
            this._failedMessages = 0;
            event.worker.stop();
            this._logger.info('Worker stopped due to limit of {count} failed message(s) is reached', { count: this._maximumNumberOfFailures });
        }
    }

    static getSubscribedEvents() {
        return {
            [ReflectionClass.getClassName(WorkerMessageFailedEvent)]: 'onMessageFailed',
            [ReflectionClass.getClassName(WorkerRunningEvent)]: 'onWorkerRunning',
        };
    }
}
