const MessageSubscriberInterface = Jymfony.Component.Messenger.Handler.MessageSubscriberInterface;
const SecondMessage = Jymfony.Component.Messenger.Fixtures.SecondMessage;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class PrioritizedHandler extends implementationOf(MessageSubscriberInterface) {
    static getHandledMessages() {
        return {
            [ ReflectionClass.getClassName(SecondMessage) ]: { priority: 10 }
        };
    }

    __invoke() {
    }
}
