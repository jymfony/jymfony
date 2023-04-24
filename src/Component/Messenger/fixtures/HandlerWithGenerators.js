const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const MessageSubscriberInterface = Jymfony.Component.Messenger.Handler.MessageSubscriberInterface;
const SecondMessage = Jymfony.Component.Messenger.Fixtures.SecondMessage;

/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class HandlerWithGenerators extends implementationOf(MessageSubscriberInterface) {
    static * getHandledMessages() {
        yield [ DummyMessage, 'dummyMethod' ];
        yield [ SecondMessage, 'secondMessage' ];
    }

    dummyMethod() {
    }

    secondMessage() {
    }
}
