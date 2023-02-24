const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const DateTime = Jymfony.Component.DateTime.DateTime;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;
const WorkerStartedEvent = Jymfony.Component.Messenger.Event.WorkerStartedEvent;

/**
 * @memberOf Jymfony.Component.Messenger.EventListener
 */
export default class StopWorkerOnTimeLimitListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {int} timeLimitInSeconds
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     */
    __construct(timeLimitInSeconds, logger = null) {
        /**
         * @type {int}
         *
         * @private
         */
        this._timeLimitInSeconds = timeLimitInSeconds;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        if (0 >= timeLimitInSeconds) {
            throw new InvalidArgumentException('Time limit must be greater than zero.');
        }

        this._endTime = 0;
    }

    onWorkerStarted() {
        const startTime = DateTime.now.microtime;
        this._endTime = startTime + this._timeLimitInSeconds;
    }

    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerRunningEvent} event
     */
    onWorkerRunning(event) {
        if (this._endTime < DateTime.now.microtime) {
            event.worker.stop();
            this._logger.info('Worker stopped due to time limit of {timeLimit}s exceeded', { timeLimit: this._timeLimitInSeconds });
        }
    }

    static getSubscribedEvents() {
        return {
            [ReflectionClass.getClassName(WorkerStartedEvent)]: 'onWorkerStarted',
            [ReflectionClass.getClassName(WorkerRunningEvent)]: 'onWorkerRunning',
        };
    }
}
