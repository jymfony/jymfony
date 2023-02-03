const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const DateTime = Jymfony.Component.DateTime.DateTime;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;
const WorkerStartedEvent = Jymfony.Component.Messenger.Event.WorkerStartedEvent;

/**
 * @memberOf Jymfony.Component.Messenger.EventListener
 */
export default class StopWorkerOnRestartSignalListener extends implementationOf(EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Cache.CacheItemPoolInterface} cachePool
     * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger = null]
     */
    __construct(cachePool, logger = null) {
        /**
         * @type {Jymfony.Contracts.Cache.CacheItemPoolInterface}
         *
         * @private
         */
        this._cachePool = cachePool;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface|null}
         *
         * @private
         */
        this._logger = logger || new NullLogger();

        /**
         * @type {float}
         *
         * @private
         */
        this._workerStartedAt = 0.0;
    }

    onWorkerStarted() {
        this._workerStartedAt = DateTime.now.microtime;
    }

    /**
     * @param {Jymfony.Component.Messenger.Event.WorkerRunningEvent} event
     */
    async onWorkerRunning(event) {
        if (await this._shouldRestart()) {
            event.worker.stop();
            this._logger.info('Worker stopped because a restart was requested.');
        }
    }

    static getSubscribedEvents() {
        return {
            [ReflectionClass.getClassName(WorkerStartedEvent)]: 'onWorkerStarted',
            [ReflectionClass.getClassName(WorkerRunningEvent)]: 'onWorkerRunning',
        };
    }

    async _shouldRestart() {
        const cacheItem = await this._cachePool.getItem(__self.RESTART_REQUESTED_TIMESTAMP_KEY);
        if (! cacheItem.isHit) {
            // No restart has ever been scheduled
            return false;
        }

        return this._workerStartedAt < cacheItem.get();
    }
}

/**
 * @type {string}
 * @const
 */
StopWorkerOnRestartSignalListener.RESTART_REQUESTED_TIMESTAMP_KEY = 'workers.restart_requested_timestamp';
