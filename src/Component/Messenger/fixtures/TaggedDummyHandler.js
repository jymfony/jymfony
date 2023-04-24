const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const MessageHandler = Jymfony.Component.Messenger.Annotation.MessageHandler;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default
@MessageHandler()
class TaggedDummyHandler {
    __invoke(@Type(DummyMessage) message) {
    }
}
