const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

/**
 * @memberOf Jymfony.Component.Messenger.EventListener
 */
export default class StopWorkerOnMemoryLimitListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {int} memoryLimit
     * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger = null]
     * @param {function(): int} [memoryResolver = null]
     */
    __construct(memoryLimit, logger = null, memoryResolver = null) {
        /**
         * @type {int}
         *
         * @private
         */
        this._memoryLimit = memoryLimit;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        /**
         * @type {function(): int}
         *
         * @private
         */
        this._memoryResolver = memoryResolver || (() => {
            const usage = process.memoryUsage();
            return usage.rss + usage.heapTotal + usage.external;
        });
    }

    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerRunningEvent} event
     */
    onWorkerRunning(event) {
        const usedMemory = this._memoryResolver();
        if (usedMemory > this._memoryLimit) {
            event.worker.stop();
            this._logger.info('Worker stopped due to memory limit of {limit} bytes exceeded ({memory} bytes used)', { limit: this._memoryLimit, memory: usedMemory });
        }
    }

    static getSubscribedEvents() {
        return {
            [ReflectionClass.getClassName(WorkerRunningEvent)]: 'onWorkerRunning',
        };
    }
}
