const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const MessageSubscriberInterface = Jymfony.Component.Messenger.Handler.MessageSubscriberInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class HandlerMappingWithNonExistentMethod extends implementationOf(MessageSubscriberInterface) {
    static getHandledMessages() {
        return {
            [ ReflectionClass.getClassName(DummyMessage) ]: 'dummyMethod',
        };
    }
}

