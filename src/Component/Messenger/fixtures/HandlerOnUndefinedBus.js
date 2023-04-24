const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const MessageSubscriberInterface = Jymfony.Component.Messenger.Handler.MessageSubscriberInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class HandlerOnUndefinedBus extends implementationOf(MessageSubscriberInterface) {
    static * getHandledMessages() {
        yield [ DummyMessage, { method: 'dummyMethodForSomeBus', bus: 'some_undefined_bus' } ];
    }

    dummyMethodForSomeBus() {
    }
}
