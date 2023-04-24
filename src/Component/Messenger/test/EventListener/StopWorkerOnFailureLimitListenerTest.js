const Envelope = Jymfony.Component.Messenger.Envelope;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
const StopWorkerOnFailureLimitListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnFailureLimitListener;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Worker = Jymfony.Component.Messenger.Worker;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

export default class StopWorkerOnFailureLimitListenerTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    @dataProvider('countProvider')
    testWorkerStopsWhenMaximumCountReached(max, shouldStop) {
        const worker = this.prophesize(Worker);
        worker.stop()[shouldStop ? 'shouldBeCalled' : 'shouldNotBeCalled']();

        const failedEvent = this.createFailedEvent();
        const runningEvent = new WorkerRunningEvent(worker.reveal(), false);

        const failureLimitListener = new StopWorkerOnFailureLimitListener(max);
        // Simulate three messages (of which 2 failed)
        failureLimitListener.onMessageFailed(failedEvent);
        failureLimitListener.onWorkerRunning(runningEvent);

        failureLimitListener.onWorkerRunning(runningEvent);

        failureLimitListener.onMessageFailed(failedEvent);
        failureLimitListener.onWorkerRunning(runningEvent);
    }

    * countProvider() {
        yield [ 1, true ];
        yield [ 2, true ];
        yield [ 3, false ];
        yield [ 4, false ];
    }

    testWorkerLogsMaximumCountReachedWhenLoggerIsGiven() {
        const logger = this.prophesize(LoggerInterface);
        logger.info('Worker stopped due to limit of {count} failed message(s) is reached', { count: 1 })
            .shouldBeCalledTimes(1);

        const worker = this.prophesize(Worker);
        const event = new WorkerRunningEvent(worker.reveal(), false);

        const failureLimitListener = new StopWorkerOnFailureLimitListener(1, logger.reveal());
        failureLimitListener.onMessageFailed(this.createFailedEvent());
        failureLimitListener.onWorkerRunning(event);
    }

    createFailedEvent() {
        const envelope = new Envelope(new DummyMessage('hello'));

        return new WorkerMessageFailedEvent(envelope, 'default', new Exception());
    }
}
