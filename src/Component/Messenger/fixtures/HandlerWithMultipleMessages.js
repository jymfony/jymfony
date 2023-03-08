const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const MessageSubscriberInterface = Jymfony.Component.Messenger.Handler.MessageSubscriberInterface;
const SecondMessage = Jymfony.Component.Messenger.Fixtures.SecondMessage;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class HandlerWithMultipleMessages extends implementationOf(MessageSubscriberInterface) {
    static getHandledMessages() {
        return [
            DummyMessage,
            SecondMessage,
        ];
    }

    __invoke() {
    }
}
