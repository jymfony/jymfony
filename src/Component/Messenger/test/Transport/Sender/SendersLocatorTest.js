const Argument = Jymfony.Component.Testing.Argument.Argument;
const ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const Envelope = Jymfony.Component.Messenger.Envelope;
const SecondMessage = Jymfony.Component.Messenger.Fixtures.SecondMessage;
const SenderInterface = Jymfony.Component.Messenger.Transport.Sender.SenderInterface;
const SendersLocator = Jymfony.Component.Messenger.Transport.Sender.SendersLocator;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TransportNamesStamp = Jymfony.Component.Messenger.Stamp.TransportNamesStamp;

export default class SendersLocatorTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testItReturnsTheSenderBasedOnTheMessageClass() {
        const sender = this.prophesize(SenderInterface);
        const sendersLocator = this.createContainer({
            my_sender: sender,
        });

        const locator = new SendersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ 'my_sender' ],
        }, sendersLocator);

        __self.assertEquals({ my_sender: sender.reveal() }, locator.getSenders(new Envelope(new DummyMessage('a'))));
        __self.assertEquals({}, locator.getSenders(new Envelope(new SecondMessage())));
    }

    testItReturnsTheSenderBasedOnTransportNamesStamp() {
        const mySender = this.prophesize(SenderInterface);
        const otherSender = this.prophesize(SenderInterface);
        const sendersLocator = this.createContainer({
            my_sender: mySender,
            other_sender: otherSender,
        });

        const locator = new SendersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ 'my_sender' ],
        }, sendersLocator);

        __self.assertEquals({ other_sender: otherSender.reveal() }, locator.getSenders(new Envelope(new DummyMessage('a'), [ new TransportNamesStamp([ 'other_sender' ]) ])));
        __self.assertEquals({}, locator.getSenders(new Envelope(new SecondMessage())));
    }

    testSendersMapWithFallback() {
        const firstSender = this.prophesize(SenderInterface);
        const secondSender = this.prophesize(SenderInterface);
        const sendersLocator = this.createContainer({
            first: firstSender,
            second: secondSender,
        });

        const locator = new SendersLocator({
            [ReflectionClass.getClassName(DummyMessage)]: [ 'first' ],
            '*': [ 'second' ],
        }, sendersLocator);

        __self.assertEquals({ first: firstSender.reveal() }, locator.getSenders(new Envelope(new DummyMessage('a'))), 'Unexpected senders for configured message');
        __self.assertEquals({ second: secondSender.reveal() }, locator.getSenders(new Envelope(new SecondMessage())), 'Unexpected senders for unconfigured message');
    }

    createContainer(senders) {
        const container = this.prophesize(ContainerInterface);
        container.has(Argument.any()).will(id => !!senders[id]);
        container.get(Argument.any()).will(id => senders[id]);

        return container.reveal();
    }
}
