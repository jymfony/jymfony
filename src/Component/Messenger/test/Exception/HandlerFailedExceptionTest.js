const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const Envelope = Jymfony.Component.Messenger.Envelope;
const HandlerFailedException = Jymfony.Component.Messenger.Exception.HandlerFailedException;
const MyOwnChildException = Jymfony.Component.Messenger.Fixtures.MyOwnChildException;
const MyOwnException = Jymfony.Component.Messenger.Fixtures.MyOwnException;

export default class HandlerFailedExceptionTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    testThatNestedExceptionClassAreFound() {
        const envelope = new Envelope({});
        const exception = new MyOwnException();

        const handlerException = new HandlerFailedException(envelope, [ new LogicException(), exception ]);
        __self.assertSame([ exception ], handlerException.getNestedExceptionOfClass(MyOwnException));
    }

    testThatNestedExceptionClassAreFoundWhenUsingChildException() {
        const envelope = new Envelope({});
        const exception = new MyOwnChildException();

        const handlerException = new HandlerFailedException(envelope, [ exception ]);
        __self.assertSame([ exception ], handlerException.getNestedExceptionOfClass(MyOwnException));
    }

    testThatNestedExceptionClassAreNotFoundIfNotPresent() {
        const envelope = new Envelope({});
        const exception = new LogicException();

        const handlerException = new HandlerFailedException(envelope, [ exception ]);
        __self.assertCount(0, handlerException.getNestedExceptionOfClass(MyOwnException));
    }
}
