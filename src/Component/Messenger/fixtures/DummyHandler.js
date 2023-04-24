const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class DummyHandler {
    __invoke(@Type(DummyMessage) message) {
    }
}
