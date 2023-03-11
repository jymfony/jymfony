const Argument = Jymfony.Component.Testing.Argument.Argument;
const CacheItemInterface = Jymfony.Contracts.Cache.CacheItemInterface;
const CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
const DateTime = Jymfony.Component.DateTime.DateTime;
const StopWorkerOnRestartSignalListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnRestartSignalListener;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TimeSensitiveTestCaseTrait = Jymfony.Component.Testing.Framework.TimeSensitiveTestCaseTrait;
const Worker = Jymfony.Component.Messenger.Worker;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

export default class StopWorkerOnRestartSignalListenerTest extends mix(TestCase, TimeSensitiveTestCaseTrait) {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    @dataProvider('restartTimeProvider')
    async testWorkerStopsWhenMemoryLimitExceeded(lastRestartTimeOffset, shouldStop) {
        const cachePool = this.prophesize(CacheItemPoolInterface);
        const cacheItem = this.prophesize(CacheItemInterface);
        cacheItem.isHit().willReturn(true);
        cacheItem.get().willReturn(null === lastRestartTimeOffset ? null : DateTime.unixTime + lastRestartTimeOffset);
        cachePool.getItem(Argument.any()).willReturn(cacheItem);

        const worker = this.prophesize(Worker);
        worker.stop()[shouldStop ? 'shouldBeCalled' : 'shouldNotBeCalled']();
        const event = new WorkerRunningEvent(worker.reveal(), false);

        const stopOnSignalListener = new StopWorkerOnRestartSignalListener(cachePool.reveal());
        stopOnSignalListener.onWorkerStarted();
        await stopOnSignalListener.onWorkerRunning(event);
    }

    * restartTimeProvider() {
        yield [ null, false ]; // No cached restart time, do not restart
        yield [ +10, true ]; // 10 seconds after starting, a restart was requested
        yield [ -10, false ]; // A restart was requested, but 10 seconds before we started
    }

    async testWorkerDoesNotStopIfRestartNotInCache() {
        const cachePool = this.prophesize(CacheItemPoolInterface);
        const cacheItem = this.prophesize(CacheItemInterface);
        cacheItem.isHit().willReturn(false);
        cacheItem.get().shouldNotBeCalled();
        cachePool.getItem(Argument.any()).willReturn(cacheItem);

        const worker = this.prophesize(Worker);
        worker.stop().shouldNotBeCalled();
        const event = new WorkerRunningEvent(worker.reveal(), false);

        const stopOnSignalListener = new StopWorkerOnRestartSignalListener(cachePool.reveal());
        stopOnSignalListener.onWorkerStarted();
        await stopOnSignalListener.onWorkerRunning(event);
    }
}
