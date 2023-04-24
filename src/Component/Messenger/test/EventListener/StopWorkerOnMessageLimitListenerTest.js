const LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
const StopWorkerOnMessageLimitListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnMessageLimitListener;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Worker = Jymfony.Component.Messenger.Worker;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

export default class StopWorkerOnMessageLimitListenerTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    @dataProvider('countProvider')
    testWorkerStopsWhenMaximumCountExceeded(max, shouldStop) {
        const worker = this.prophesize(Worker);
        worker.stop()[shouldStop ? 'shouldBeCalled' : 'shouldNotBeCalled']();
        const event = new WorkerRunningEvent(worker.reveal(), false);

        const maximumCountListener = new StopWorkerOnMessageLimitListener(max);

        // Simulate three messages processed
        maximumCountListener.onWorkerRunning(event);
        maximumCountListener.onWorkerRunning(event);
        maximumCountListener.onWorkerRunning(event);
    }

    * countProvider() {
        yield [ 1, true ];
        yield [ 2, true ];
        yield [ 3, true ];
        yield [ 4, false ];
    }

    testWorkerLogsMaximumCountExceededWhenLoggerIsGiven() {
        const logger = this.prophesize(LoggerInterface);
        logger.info('Worker stopped due to maximum count of {count} messages processed', { count: 1 }).shouldBeCalled();

        const worker = this.prophesize(Worker);
        const event = new WorkerRunningEvent(worker.reveal(), false);

        const maximumCountListener = new StopWorkerOnMessageLimitListener(1, logger.reveal());
        maximumCountListener.onWorkerRunning(event);
    }
}
