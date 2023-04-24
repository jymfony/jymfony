const MessageHandlerInterface = Jymfony.Component.Messenger.Handler.MessageHandlerInterface;
const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class UndefinedMessageHandlerViaHandlerInterface extends implementationOf(MessageHandlerInterface) {
    __invoke(@Type('UndefinedMessage') message) {
    }
}
