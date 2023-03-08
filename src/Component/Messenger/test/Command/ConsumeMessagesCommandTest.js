const Argument = Jymfony.Component.Testing.Argument.Argument;
const BusNameStamp = Jymfony.Component.Messenger.Stamp.BusNameStamp;
const CommandCompletionTester = Jymfony.Component.Console.Tester.CommandCompletionTester;
const CommandTester = Jymfony.Component.Console.Tester.CommandTester;
const ConsumeMessagesCommand = Jymfony.Component.Messenger.Command.ConsumeMessagesCommand;
const ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
const Envelope = Jymfony.Component.Messenger.Envelope;
const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const EventDispatcherInterface = Jymfony.Contracts.EventDispatcher.EventDispatcherInterface;
const InvalidOptionException = Jymfony.Component.Console.Exception.InvalidOptionException;
const MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;
const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;
const RoutableMessageBus = Jymfony.Component.Messenger.RoutableMessageBus;
const ServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class ConsumeMessagesCommandTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    testConfigurationWithDefaultReceiver() {
        const messageBus = this.prophesize(RoutableMessageBus);
        const serviceLocator = this.prophesize(ServiceLocator);
        const eventDispatcher = this.prophesize(EventDispatcherInterface);

        const command = new ConsumeMessagesCommand(
            messageBus.reveal(),
            serviceLocator.reveal(),
            eventDispatcher.reveal(),
            null,
            [ 'amqp' ]
        );

        const inputArgument = command.definition.getArgument('receivers');
        __self.assertFalse(inputArgument.isRequired());
        __self.assertSame([ 'amqp' ], inputArgument.getDefault());
    }

    async testBasicRun() {
        const envelope = new Envelope({}, [ new BusNameStamp('dummy-bus') ]);

        const receiver = this.prophesize(ReceiverInterface);
        receiver.get()
            .shouldBeCalledTimes(1)
            .willReturn([ envelope ]);

        receiver.ack(envelope).shouldBeCalledTimes(1);

        const receiverLocator = this.prophesize(ContainerInterface);
        receiverLocator.has('dummy-receiver').shouldBeCalledTimes(1).willReturn(true);
        receiverLocator.get('dummy-receiver').shouldBeCalledTimes(1).willReturn(receiver);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.cetera()).shouldBeCalledTimes(1).willReturnArgument(0);

        const busLocator = this.prophesize(ContainerInterface);
        busLocator.has('dummy-bus').shouldBeCalledTimes(1).willReturn(true);
        busLocator.get('dummy-bus').shouldBeCalledTimes(1).willReturn(bus);

        const command = new ConsumeMessagesCommand(new RoutableMessageBus(busLocator.reveal()), receiverLocator.reveal(), new EventDispatcher());
        const tester = new CommandTester(command);
        await tester.run({
            receivers: [ 'dummy-receiver' ],
            '--limit': 1,
        });

        __self.assertEquals(0, tester.exitCode);
        __self.assertStringContainsString('[OK] Consuming messages from transport "dummy-receiver"', tester.getDisplay());
    }

    async testRunWithBusOption() {
        const envelope = new Envelope({});

        const receiver = this.prophesize(ReceiverInterface);
        receiver.get()
            .shouldBeCalledTimes(1)
            .willReturn([ envelope ]);

        receiver.ack(envelope).shouldBeCalledTimes(1);

        const receiverLocator = this.prophesize(ContainerInterface);
        receiverLocator.has('dummy-receiver').shouldBeCalledTimes(1).willReturn(true);
        receiverLocator.get('dummy-receiver').shouldBeCalledTimes(1).willReturn(receiver);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.cetera()).shouldBeCalledTimes(1).willReturnArgument(0);

        const busLocator = this.prophesize(ContainerInterface);
        busLocator.has('dummy-bus').shouldBeCalledTimes(1).willReturn(true);
        busLocator.get('dummy-bus').shouldBeCalledTimes(1).willReturn(bus);

        const command = new ConsumeMessagesCommand(new RoutableMessageBus(busLocator.reveal()), receiverLocator.reveal(), new EventDispatcher());
        const tester = new CommandTester(command);
        await tester.run({
            receivers: [ 'dummy-receiver' ],
            '--bus': 'dummy-bus',
            '--limit': 1,
        });

        __self.assertEquals(0, tester.exitCode);
        __self.assertStringContainsString('[OK] Consuming messages from transport "dummy-receiver"', tester.getDisplay());
    }

    @dataProvider('getInvalidOptions')
    async testRunWithInvalidOption(option, value, expectedMessage) {
        const receiverLocator = this.prophesize(ContainerInterface);
        receiverLocator.has('dummy-receiver').willReturn(true);
        receiverLocator.get('dummy-receiver').willReturn(this.prophesize(ReceiverInterface));

        const busLocator = this.prophesize(ContainerInterface);

        const command = new ConsumeMessagesCommand(new RoutableMessageBus(busLocator.reveal()), receiverLocator.reveal(), new EventDispatcher());
        const tester = new CommandTester(command);

        this.expectException(InvalidOptionException);
        this.expectExceptionMessage(expectedMessage);
        await tester.run({
            receivers: [ 'dummy-receiver' ],
            [option]: value,
        });
    }

    * getInvalidOptions() {
        yield [ '--limit', '0', 'Option "limit" must be a positive integer, "0" passed.' ];
        yield [ '--limit', 'whatever', 'Option "limit" must be a positive integer, "whatever" passed.' ];

        yield [ '--time-limit', '0', 'Option "time-limit" must be a positive integer, "0" passed.' ];
        yield [ '--time-limit', 'whatever', 'Option "time-limit" must be a positive integer, "whatever" passed.' ];
    }

    async testRunWithTimeLimit() {
        this.setTimeout(10000);
        const envelope = new Envelope({}, [ new BusNameStamp('dummy-bus') ]);

        const receiver = this.prophesize(ReceiverInterface);
        receiver.get().willReturn([ envelope ], []);
        receiver.ack(envelope).shouldBeCalledTimes(1);

        const receiverLocator = this.prophesize(ContainerInterface);
        receiverLocator.has('dummy-receiver').willReturn(true);
        receiverLocator.get('dummy-receiver').willReturn(receiver);

        const bus = this.prophesize(MessageBusInterface);
        bus.dispatch(Argument.cetera()).shouldBeCalledTimes(1).willReturnArgument(0);

        const busLocator = this.prophesize(ContainerInterface);
        busLocator.has('dummy-bus').willReturn(true);
        busLocator.get('dummy-bus').willReturn(bus);

        const command = new ConsumeMessagesCommand(new RoutableMessageBus(busLocator.reveal()), receiverLocator.reveal(), new EventDispatcher());
        const tester = new CommandTester(command);
        await tester.run({
            receivers: [ 'dummy-receiver' ],
            '--time-limit': 1,
        });

        __self.assertEquals(0, tester.exitCode);
        __self.assertStringContainsString('[OK] Consuming messages from transport "dummy-receiver"', tester.getDisplay());
    }

    @dataProvider('provideCompletionSuggestions')
    async testComplete(input, expectedSuggestions) {
        const bus = this.prophesize(RoutableMessageBus);
        const receiverLocator = this.prophesize(ContainerInterface);
        const command = new ConsumeMessagesCommand(bus.reveal(), receiverLocator.reveal(), new EventDispatcher(), null, [ 'async', 'async_high', 'failed' ], [ 'messenger.bus.default' ]);

        const tester = new CommandCompletionTester(command);
        const suggestions = await tester.complete(input);
        __self.assertEquals(expectedSuggestions, suggestions);
    }

    * provideCompletionSuggestions() {
        yield [ [ '' ], [ 'async', 'async_high', 'failed' ] ];
        yield [ [ 'async' ], [ 'async', 'async_high', 'failed' ] ];
        yield [ [ 'async', '' ], [ 'async_high', 'failed' ] ];
        yield [ [ '--bus', '' ], [ 'messenger.bus.default' ] ];
    }
}
