const Argument = Jymfony.Component.Testing.Argument.Argument;
const ChildDummyMessage = Jymfony.Component.Messenger.Fixtures.ChildDummyMessage;
const ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const DummyMessageInterface = Jymfony.Component.Messenger.Fixtures.DummyMessageInterface;
const EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
const Envelope = Jymfony.Component.Messenger.Envelope;
const MiddlewareTestCase = Jymfony.Component.Messenger.Test.MiddlewareTestCase;
const NoSenderForMessageException = Jymfony.Component.Messenger.Exception.NoSenderForMessageException;
const ReceivedStamp = Jymfony.Component.Messenger.Stamp.ReceivedStamp;
const SendMessageMiddleware = Jymfony.Component.Messenger.Middleware.SendMessageMiddleware;
const SendMessageToTransportsEvent = Jymfony.Component.Messenger.Event.SendMessageToTransportsEvent;
const SenderInterface = Jymfony.Component.Messenger.Transport.Sender.SenderInterface;
const SendersLocator = Jymfony.Component.Messenger.Transport.Sender.SendersLocator;
const SentStamp = Jymfony.Component.Messenger.Stamp.SentStamp;

export default class SendMessageMiddlewareTest extends MiddlewareTestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testItSendsTheMessageToAssignedSender() {
        const message = new DummyMessage('Hey');
        let envelope = new Envelope(message);
        const sender = this.prophesize(SenderInterface);

        const sendersLocator = this.createSendersLocator(
            { [ReflectionClass.getClassName(DummyMessage)]: [ 'my_sender' ] },
            { my_sender: sender.reveal() }
        );
        const middleware = new SendMessageMiddleware(sendersLocator);

        sender.send(envelope.withStamps(new SentStamp(ReflectionClass.getClassName(sender), 'my_sender'))).willReturnArgument(0);

        envelope = await middleware.handle(envelope, this._getStackMock(false));

        const stamp = envelope.last(SentStamp);
        __self.assertInstanceOf(SentStamp, stamp, 'it adds a sent stamp');
        __self.assertEquals('my_sender', stamp.senderAlias);
        __self.assertEquals('_jymfony_testing_doubler_double__', stamp.senderClass);
    }

    async testItSendsTheMessageToMultipleSenders() {
        let envelope = new Envelope(new DummyMessage('Hey'));
        const sender = this.prophesize(SenderInterface);
        const sender2 = this.prophesize(SenderInterface);

        const sendersLocator = this.createSendersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ 'foo', 'bar' ] },
        { foo: sender.reveal(), bar: sender2.reveal() }
        );
        const middleware = new SendMessageMiddleware(sendersLocator);

        sender.send(Argument.that(envelope => {
            const lastSentStamp = envelope.last(SentStamp);

            // Last SentStamp should be the "foo" alias
            return null !== lastSentStamp && 'foo' === lastSentStamp.senderAlias;
        }))
            .shouldBeCalledTimes(1)
            .willReturnArgument(0);

        sender2.send(Argument.that(envelope => {
            const lastSentStamp = envelope.last(SentStamp);

            // Last SentStamp should be the "bar" alias
            return null !== lastSentStamp && 'bar' === lastSentStamp.senderAlias;
        }))
            .shouldBeCalledTimes(1)
            .willReturnArgument(0);

        envelope = await middleware.handle(envelope, this._getStackMock(false));

        /** @var SentStamp[] $sentStamps */
        const sentStamps = envelope.all(SentStamp);
        __self.assertCount(2, sentStamps);
    }

    async testItSendsTheMessageToAssignedSenderWithPreWrappedMessage() {
        const envelope = new Envelope(new ChildDummyMessage('Hey'));
        const sender = this.prophesize(SenderInterface);

        const sendersLocator = this.createSendersLocator({ [ReflectionClass.getClassName(DummyMessage)]: [ 'foo_sender' ] }, { foo_sender: sender });
        const middleware = new SendMessageMiddleware(sendersLocator);

        sender.send(envelope.withStamps(new SentStamp(ReflectionClass.getClassName(sender), 'foo_sender')))
            .shouldBeCalledTimes(1)
            .willReturn(envelope);

        await middleware.handle(envelope, this._getStackMock(false));
    }

    async testItSendsTheMessageBasedOnTheMessageParentClass() {
        const message = new ChildDummyMessage('Hey');
        const envelope = new Envelope(message);
        const sender = this.prophesize(SenderInterface);

        const sendersLocator = this.createSendersLocator({ [ReflectionClass.getClassName(DummyMessage)]: [ 'foo_sender' ] }, { foo_sender: sender });
        const middleware = new SendMessageMiddleware(sendersLocator);

        sender.send(envelope.withStamps(new SentStamp(ReflectionClass.getClassName(sender), 'foo_sender')))
            .shouldBeCalledTimes(1)
            .willReturn(envelope);

        await middleware.handle(envelope, this._getStackMock(false));
    }

    async testItSendsTheMessageBasedOnTheMessageInterface() {
        const message = new DummyMessage('Hey');
        const envelope = new Envelope(message);
        const sender = this.prophesize(SenderInterface);

        const sendersLocator = this.createSendersLocator({ [ReflectionClass.getClassName(DummyMessageInterface)]: [ 'foo_sender' ] }, { foo_sender: sender });
        const middleware = new SendMessageMiddleware(sendersLocator);

        sender.send(envelope.withStamps(new SentStamp(ReflectionClass.getClassName(sender), 'foo_sender')))
            .shouldBeCalledTimes(1)
            .willReturn(envelope);

        await middleware.handle(envelope, this._getStackMock(false));
    }

    async testItSendsTheMessageBasedOnWildcard() {
        const message = new DummyMessage('Hey');
        const envelope = new Envelope(message);
        const sender = this.prophesize(SenderInterface);

        const sendersLocator = this.createSendersLocator({ '*': [ 'foo_sender' ] }, { foo_sender: sender });
        const middleware = new SendMessageMiddleware(sendersLocator);

        sender.send(envelope.withStamps(new SentStamp(ReflectionClass.getClassName(sender), 'foo_sender')))
            .shouldBeCalledTimes(1)
            .willReturn(envelope);

        await middleware.handle(envelope, this._getStackMock(false));
    }

    async testItCallsTheNextMiddlewareWhenNoSenderForThisMessage() {
        const message = new DummyMessage('Hey');
        const envelope = new Envelope(message);

        const middleware = new SendMessageMiddleware(this.createSendersLocator({}, {}));
        await middleware.handle(envelope, this._getStackMock());
    }

    async testItSkipsReceivedMessages() {
        let envelope = (new Envelope(new DummyMessage('Hey'))).withStamps(new ReceivedStamp('transport'));
        const sender = this.prophesize(SenderInterface);

        const sendersLocator = this.createSendersLocator({ '*': [ 'foo' ] }, { foo: sender.reveal() });
        const middleware = new SendMessageMiddleware(sendersLocator);

        sender.send(Argument.cetera()).shouldNotBeCalled();

        envelope = await middleware.handle(envelope, this._getStackMock());
        __self.assertNull(envelope.last(SentStamp), 'it does not add sent stamp for received messages');
    }

    async testItDispatchesTheEventOneTime() {
        const envelope = new Envelope(new DummyMessage('original envelope'));

        const sender1 = this.prophesize(SenderInterface);
        const sender2 = this.prophesize(SenderInterface);

        const dispatcher = this.prophesize(EventDispatcherInterface);
        dispatcher.dispatch(new SendMessageToTransportsEvent(envelope, { foo: sender1.reveal(), bar: sender2.reveal() }))
            .shouldBeCalledTimes(1);

        const sendersLocator = this.createSendersLocator(
            { [ReflectionClass.getClassName(DummyMessage)]: [ 'foo', 'bar' ] },
            { foo: sender1.reveal(), bar: sender2.reveal() }
        );
        const middleware = new SendMessageMiddleware(sendersLocator, dispatcher.reveal());

        sender1.send(Argument.cetera()).willReturn(envelope);
        sender2.send(Argument.cetera()).willReturn(envelope);

        await middleware.handle(envelope, this._getStackMock(false));
    }

    async testItDoesNotDispatchWithNoSenders() {
        const envelope = new Envelope(new DummyMessage('original envelope'));

        const dispatcher = this.prophesize(EventDispatcherInterface);
        dispatcher.dispatch(Argument.cetera()).shouldNotBeCalled();

        const middleware = new SendMessageMiddleware(this.createSendersLocator({}, {}), dispatcher.reveal());

        await middleware.handle(envelope, this._getStackMock());
    }

    async testThrowsNoRoutingException() {
        const envelope = new Envelope(new DummyMessage('original envelope'));

        const dispatcher = this.prophesize(EventDispatcherInterface);

        const sendersLocator = this.createSendersLocator({ [ReflectionClass.getClassName(DummyMessage)]: [] }, {});

        this.expectException(NoSenderForMessageException);
        this.expectExceptionMessage('No sender for message "Jymfony.Component.Messenger.Fixtures.DummyMessage".');

        const middleware = new SendMessageMiddleware(sendersLocator, dispatcher.reveal(), false);
        await middleware.handle(envelope, this._getStackMock(false));
    }

    async testAllowNoRouting() {
        const envelope = new Envelope(new DummyMessage('original envelope'));

        const sender = this.prophesize(SenderInterface);

        const dispatcher = this.prophesize(EventDispatcherInterface);
        dispatcher.dispatch(new SendMessageToTransportsEvent(envelope, { foo: sender })).shouldBeCalledTimes(1);

        const sendersLocator = this.createSendersLocator({ [ReflectionClass.getClassName(DummyMessage)]: [ 'foo' ] }, { foo: sender.reveal() });
        const middleware = new SendMessageMiddleware(sendersLocator, dispatcher.reveal());

        sender.send(Argument.cetera()).willReturn(envelope);

        await middleware.handle(envelope, this._getStackMock(false));
    }

    createSendersLocator(sendersMap, senders) {
        const container = this.prophesize(ContainerInterface);
        container.has(Argument.any()).will(id => undefined !== senders[id]);
        container.get(Argument.any()).will(id => senders[id]);

        return new SendersLocator(sendersMap, container.reveal());
    }
}
