const MessageSubscriberInterface = Jymfony.Component.Messenger.Handler.MessageSubscriberInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class UndefinedMessageHandlerViaSubscriberInterface extends implementationOf(MessageSubscriberInterface) {
    static getHandledMessages() {
        return ['UndefinedMessage'];
    }

    __invoke() {
    }
}
