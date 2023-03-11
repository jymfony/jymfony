const AddErrorDetailsStampListener = Jymfony.Component.Messenger.EventListener.AddErrorDetailsStampListener;
const Envelope = Jymfony.Component.Messenger.Envelope;
const ErrorDetailsStamp = Jymfony.Component.Messenger.Stamp.ErrorDetailsStamp;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const WorkerMessageFailedEvent = Jymfony.Component.Messenger.Event.WorkerMessageFailedEvent;

export default class AddErrorDetailsStampListenerTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    testExceptionDetailsAreAdded() {
        const listener = new AddErrorDetailsStampListener();

        const envelope = new Envelope({});
        const exception = new Exception('It failed!');
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', exception);
        const expectedStamp = ErrorDetailsStamp.create(exception);

        listener.onMessageFailed(event);

        __self.assertEquals(expectedStamp, event.envelope.last(ErrorDetailsStamp));
    }

    testWorkerAddsNewErrorDetailsStampOnFailure() {
        const listener = new AddErrorDetailsStampListener();

        const envelope = new Envelope({}, [
            ErrorDetailsStamp.create(new InvalidArgumentException('First error!')),
        ]);

        const exception = new Exception('Second error!');
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', exception);
        const expectedStamp = ErrorDetailsStamp.create(exception);

        listener.onMessageFailed(event);

        __self.assertEquals(expectedStamp, event.envelope.last(ErrorDetailsStamp));
        __self.assertCount(2, event.envelope.all(ErrorDetailsStamp));
    }

    testWorkerDoesNotAddDuplicateErrorDetailsStampOnFailure() {
        const listener = new AddErrorDetailsStampListener();

        const envelope = new Envelope({}, [ new Exception('It failed!') ]);
        const event = new WorkerMessageFailedEvent(envelope, 'my_receiver', new Exception('It failed!'));

        listener.onMessageFailed(event);

        __self.assertCount(1, event.envelope.all(ErrorDetailsStamp));
    }
}
