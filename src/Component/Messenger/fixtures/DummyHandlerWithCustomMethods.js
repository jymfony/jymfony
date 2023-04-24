const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const SecondMessage = Jymfony.Component.Messenger.Fixtures.SecondMessage;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class DummyHandlerWithCustomMethods {
    handleDummyMessage(@Type(DummyMessage) message) {
    }

    handleSecondMessage(@Type(SecondMessage) message) {
    }
}
