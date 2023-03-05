const Argument = Jymfony.Component.Testing.Argument.Argument;
const CommandCompletionTester = Jymfony.Component.Console.Tester.CommandCompletionTester;
const CommandTester = Jymfony.Component.Console.Tester.CommandTester;
const ServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;
const SetupTransportsCommand = Jymfony.Component.Messenger.Command.SetupTransportsCommand;
const SetupableTransportInterface = Jymfony.Component.Messenger.Transport.SetupableTransportInterface;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TransportInterface = Jymfony.Component.Messenger.Transport.TransportInterface;

export default class SetupTransportsCommandTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    async testReceiverNames() {
        const serviceLocator = this.prophesize(ServiceLocator);
        // Get method must be call twice and will return consecutively a setup-able transport and a non setup-able transport
        serviceLocator.get('amqp').willReturn(this.prophesize(SetupableTransportInterface));
        serviceLocator.get('other_transport').willReturn(this.prophesize(TransportInterface));

        serviceLocator.has('amqp').willReturn(true);
        serviceLocator.has('other_transport').willReturn(true);

        const command = new SetupTransportsCommand(serviceLocator.reveal(), [ 'amqp', 'other_transport' ]);
        const tester = new CommandTester(command);
        await tester.run({});

        const display = tester.getDisplay();

        __self.assertStringContainsString('The "amqp" transport was set up successfully.', display);
        __self.assertStringContainsString('The "other_transport" transport does not support setup.', display);
    }

    async testReceiverNameArgument() {
        const serviceLocator = this.prophesize(ServiceLocator);

        serviceLocator.get('amqp').willReturn(this.prophesize(SetupableTransportInterface));
        serviceLocator.has('amqp').willReturn(true);

        const command = new SetupTransportsCommand(serviceLocator.reveal(), [ 'amqp', 'other_transport' ]);
        const tester = new CommandTester(command);
        await tester.run({ transport: 'amqp' });

        const display = tester.getDisplay();
        __self.assertStringContainsString('The "amqp" transport was set up successfully.', display);
    }

    async testReceiverNameArgumentNotFound() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('The "not_found" transport does not exist.');

        const serviceLocator = this.prophesize(ServiceLocator);
        serviceLocator.get(Argument.any()).shouldNotBeCalled();
        serviceLocator.has('not_found').willReturn(false);

        const command = new SetupTransportsCommand(serviceLocator.reveal(), [ 'amqp', 'other_transport' ]);
        const tester = new CommandTester(command);
        await tester.run({ transport: 'not_found' });
    }

    @dataProvider('provideCompletionSuggestions')
    async testComplete(input, expectedSuggestions) {
        const serviceLocator = this.prophesize(ServiceLocator);
        const command = new SetupTransportsCommand(serviceLocator.reveal(), [ 'amqp', 'other_transport' ]);

        const tester = new CommandCompletionTester(command);
        const suggestions = await tester.complete(input);
        __self.assertEquals(expectedSuggestions, suggestions);
    }

    * provideCompletionSuggestions() {
        yield [ [ '' ], [ 'amqp', 'other_transport' ] ];
    }
}
