const Event = Jymfony.Contracts.EventDispatcher.Event;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class EventTest extends TestCase {
    get testCaseName() {
        return '[Contracts] ' + super.testCaseName;
    }

    testStopPropagationFlagIsFalsyAtConstruction() {
        const event = new Event();
        __self.assertFalse(event.isPropagationStopped());
    }

    testStopPropagationFlagShouldBeSetCorrectly() {
        const event = new Event();
        __self.assertFalse(event.isPropagationStopped());

        event.stopPropagation();
        __self.assertTrue(event.isPropagationStopped());
    }
}
