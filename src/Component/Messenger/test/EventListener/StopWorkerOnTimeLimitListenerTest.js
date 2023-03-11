const LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
const StopWorkerOnTimeLimitListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnTimeLimitListener;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TimeSensitiveTestCaseTrait = Jymfony.Component.Testing.Framework.TimeSensitiveTestCaseTrait;
const Worker = Jymfony.Component.Messenger.Worker;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

export default class StopWorkerOnTimeLimitListenerTest extends mix(TestCase, TimeSensitiveTestCaseTrait) {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testWorkerStopsWhenTimeLimitIsReached() {
        const logger = this.prophesize(LoggerInterface);
        logger.info('Worker stopped due to time limit of {timeLimit}s exceeded', { timeLimit: 1 }).shouldBeCalledTimes(1);

        const worker = this.prophesize(Worker);
        worker.stop().shouldBeCalledTimes(1);
        const event = new WorkerRunningEvent(worker.reveal(), false);

        const timeoutListener = new StopWorkerOnTimeLimitListener(1, logger.reveal());
        timeoutListener.onWorkerStarted();
        await __jymfony.sleep(2000);
        timeoutListener.onWorkerRunning(event);
    }
}
