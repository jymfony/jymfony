declare namespace Jymfony.Component.Messenger.EventListener {
    import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
    import WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

    export class StopWorkerOnRestartSignalListener extends implementationOf(EventSubscriberInterface) {
        public static readonly RESTART_REQUESTED_TIMESTAMP_KEY = 'workers.restart_requested_timestamp'

        private _cachePool: CacheItemPoolInterface;
        private _logger: LoggerInterface;
        private _workerStartedAt: number;

        /**
         * Constructor.
         */
        __construct(cachePool: CacheItemPoolInterface, logger?: LoggerInterface): void;
        constructor(cachePool: CacheItemPoolInterface, logger?: LoggerInterface);

        onWorkerStarted(): void;

        onWorkerRunning(event: WorkerRunningEvent): Promise<void>;

        static getSubscribedEvents(): EventSubscriptions;

        _shouldRestart(): Promise<boolean>;
    }
}
