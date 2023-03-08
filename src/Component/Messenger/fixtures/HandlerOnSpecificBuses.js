const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const MessageSubscriberInterface = Jymfony.Component.Messenger.Handler.MessageSubscriberInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class HandlerOnSpecificBuses extends implementationOf(MessageSubscriberInterface)
{
    static * getHandledMessages() {
        yield [ DummyMessage, { method: 'dummyMethodForEvents', bus: 'event_bus' } ];
        yield [ DummyMessage, { method: 'dummyMethodForCommands', bus: 'command_bus' } ];
    }

    dummyMethodForEvents() {
    }

    dummyMethodForCommands() {
    }
}
