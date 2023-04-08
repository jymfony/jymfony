const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const EventListener = Jymfony.Component.EventDispatcher.Annotation.EventListener;

export default class EventListenerTest extends TestCase {
    get testCaseName() {
        return '[EventDispatcher] ' + super.testCaseName;
    }

    testShouldAcceptStringEvent() {
        const annot = new EventListener({ event: 'http.request' });
        __self.assertSame('http.request', annot.event);
    }

    testShouldAcceptClassAsEvent() {
        const annot = new EventListener({ event: __self });
        __self.assertSame(ReflectionClass.getClassName(__self), annot.event);
    }

    testShouldThrowIfNoEventIsPassed() {
        this.expectException(LogicException);
        new EventListener({ method: 'test' });
    }
}
