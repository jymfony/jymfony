const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const MessageSubscriberInterface = Jymfony.Component.Messenger.Handler.MessageSubscriberInterface;
const SecondMessage = Jymfony.Component.Messenger.Fixtures.SecondMessage;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class HandlerMappingMethods extends implementationOf(MessageSubscriberInterface) {
    static getHandledMessages() {
        return {
            [ ReflectionClass.getClassName(DummyMessage) ]: 'dummyMethod',
            [ ReflectionClass.getClassName(SecondMessage) ]: { method: 'secondMessage', priority: 20 }
        };
    }

    dummyMethod() {
    }

    secondMessage() {
    }
}
