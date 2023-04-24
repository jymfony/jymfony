const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const InvalidArgumentException = Jymfony.Component.Messenger.Exception.InvalidArgumentException;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

/**
 * @memberOf Jymfony.Component.Messenger.EventListener
 */
export default class StopWorkerOnMessageLimitListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {int} maximumNumberOfMessages
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     */
    __construct(maximumNumberOfMessages, logger = null) {
        /**
         * @type {int}
         *
         * @private
         */
        this._maximumNumberOfMessages = maximumNumberOfMessages;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         * @private
         */
        this._logger = logger;

        /**
         * @type {int}
         *
         * @private
         */
        this._receivedMessages = 0;

        if (0 >= maximumNumberOfMessages) {
            throw new InvalidArgumentException('Message limit must be greater than zero.');
        }
    }

    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerRunningEvent} event
     */
    onWorkerRunning(event) {
        if (!event.isWorkerIdle && ++this._receivedMessages >= this._maximumNumberOfMessages) {
            this._receivedMessages = 0;
            event.worker.stop();

            if (null !== this._logger) {
                this._logger.info('Worker stopped due to maximum count of {count} messages processed', { count: this._maximumNumberOfMessages });
            }
        }
    }

    static getSubscribedEvents() {
        return {
            [ReflectionClass.getClassName(WorkerRunningEvent)]: 'onWorkerRunning',
        };
    }
}
