const Envelope = Jymfony.Component.Messenger.Envelope;
const HandlerFailedException = Jymfony.Component.Messenger.Exception.HandlerFailedException;
const StopWorkerException = Jymfony.Component.Messenger.Exception.StopWorkerException;
const StopWorkerExceptionInterface = Jymfony.Component.Messenger.Exception.StopWorkerExceptionInterface;
const StopWorkerOnCustomStopExceptionListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnCustomStopExceptionListener;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Worker = Jymfony.Component.Messenger.Worker;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;
const WorkerRunningEvent = Jymfony.Component.Messenger.Event.WorkerRunningEvent;

export default class StopWorkerOnCustomStopExceptionListenerTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    * provideTests() {
        yield [ new Exception(), false ];
        yield [ new HandlerFailedException(new Envelope({}), [ new Exception() ]), false ];

        const t = new class extends mix(Exception, StopWorkerExceptionInterface) {}();
        yield [ t, true ];
        yield [ new StopWorkerException(), true ];

        yield [ new HandlerFailedException(new Envelope({}), [ new StopWorkerException() ]), true ];
        yield [ new HandlerFailedException(new Envelope({}), [ new Exception(), new StopWorkerException() ]), true ];
        yield [ new HandlerFailedException(new Envelope({}), [ t ]), true ];
        yield [ new HandlerFailedException(new Envelope({}), [ new Exception(), t ]), true ];
    }

    @dataProvider ('provideTests')
    testListener(throwable, shouldStop) {
        const listener = new StopWorkerOnCustomStopExceptionListener();

        const envelope = new Envelope({});
        const failedEvent = new WorkerMessageFailedEvent(envelope, 'my_receiver', throwable);

        listener.onMessageFailed(failedEvent);

        const worker = this.prophesize(Worker);
        worker.stop()[shouldStop ? 'shouldBeCalled' : 'shouldNotBeCalled']();

        const runningEvent = new WorkerRunningEvent(worker.reveal(), false);
        listener.onWorkerRunning(runningEvent);
    }
}
