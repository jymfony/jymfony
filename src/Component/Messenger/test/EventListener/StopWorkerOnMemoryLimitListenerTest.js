const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;
const StopWorkerOnMemoryLimitListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnMemoryLimitListener;
const Worker = Jymfony.Component.Messenger.Worker;

export default class StopWorkerOnMemoryLimitListenerTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    @dataProvider('memoryProvider')
    testWorkerStopsWhenMemoryLimitExceeded(memoryUsage, memoryLimit, shouldStop) {
        const worker = this.prophesize(Worker);
        worker.stop()[shouldStop ? 'shouldBeCalled' : 'shouldNotBeCalled']();

        const event = new WorkerRunningEvent(worker.reveal(), false);

        const memoryLimitListener = new StopWorkerOnMemoryLimitListener(memoryLimit, null, () => memoryUsage);
        memoryLimitListener.onWorkerRunning(event);
    }

    * memoryProvider() {
        yield [ 2048, 1024, true ];
        yield [ 1024, 1024, false ];
        yield [ 1024, 2048, false ];
    }

    testWorkerLogsMemoryExceededWhenLoggerIsGiven() {
        const logger = this.prophesize(LoggerInterface);
        logger.info('Worker stopped due to memory limit of {limit} bytes exceeded ({memory} bytes used)', { limit: 64, memory: 70 }).shouldBeCalled();

        const worker = this.prophesize(Worker);
        const event = new WorkerRunningEvent(worker.reveal(), false);

        const memoryLimitListener = new StopWorkerOnMemoryLimitListener(64, logger.reveal(), () => 70);
        memoryLimitListener.onWorkerRunning(event);
    }
}
