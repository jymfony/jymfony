const Type = Jymfony.Component.Autoloader.Decorator.Type;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class UndefinedMessageHandler {
    __invoke(@Type('UndefinedMessage') message) {
    }
}
