const MessageSubscriberInterface = Jymfony.Component.Messenger.Handler.MessageSubscriberInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class HandleNoMessageHandler extends implementationOf(MessageSubscriberInterface) {
    static getHandledMessages() {
        return [];
    }

    __invoke() {
    }
}
