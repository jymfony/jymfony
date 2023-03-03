const path = require('path');
const os = require('os');

const Application = Jymfony.Component.Console.Application;
const Command = Jymfony.Component.Console.Command.Command;
const CommandTester = Jymfony.Component.Console.Tester.CommandTester;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const InvalidOptionException = Jymfony.Component.Console.Exception.InvalidOptionException;
const NullOutput = Jymfony.Component.Console.Output.NullOutput;
const StringInput = Jymfony.Component.Console.Input.StringInput;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const fixtures_path = path.join(__dirname, '..', '..', 'fixtures');
const Fixtures = new Jymfony.Component.Autoloader.Namespace(__jymfony.autoload, 'Fixtures', [
    fixtures_path,
]);

export default class CommandTest extends TestCase {
    get testCaseName() {
        return '[Console] ' + super.testCaseName;
    }

    testConstructor() {
        const command = new Command('foo:bar');
        __self.assertEquals('foo:bar', command.name, '__construct() takes the command name as its first argument');
    }

    testCommandNameCannotBeEmpty() {
        this.expectException(LogicException);
        this.expectExceptionMessage('The command defined in "Jymfony.Component.Console.Command.Command" cannot have an empty name.');
        (new Application()).add(new Command());
    }

    testSetApplication() {
        const application = new Application();
        const command = new Fixtures.TestCommand();
        command.application = application;

        __self.assertEquals(application, command.application, 'set application sets the current application');
    }

    testSetApplicationNull() {
        const command = new Fixtures.TestCommand();
        command.application = null;
        __self.assertNull(command.application);
    }

    testSetGetDefinition() {
        const command = new Fixtures.TestCommand();
        const definition = new InputDefinition();
        command.definition = definition;

        __self.assertEquals(definition, command.definition, 'set definition() sets the current InputDefinition instance');

        command.definition = [ new InputArgument('foo'), new InputOption('bar') ];

        __self.assertTrue(command.definition.hasArgument('foo'), 'set definition() also takes an array of InputArguments and InputOptions as an argument');
        __self.assertTrue(command.definition.hasOption('bar'), 'set definition() also takes an array of InputArguments and InputOptions as an argument');
    }

    testAddArgument() {
        const command = new Fixtures.TestCommand();
        const ret = command.addArgument('foo');

        __self.assertEquals(command, ret, '.addArgument() implements a fluent interface');
        __self.assertTrue(command.definition.hasArgument('foo'), '.addArgument() adds an argument to the command');
    }

    testAddArgumentFull() {
        const command = new Fixtures.TestCommand();
        command.addArgument('foo', InputArgument.OPTIONAL, 'Description', 'default', [ 'a', 'b' ]);

        const argument = command.definition.getArgument('foo');
        __self.assertEquals('Description', argument.getDescription());
        __self.assertEquals('default', argument.getDefault());
        __self.assertTrue(argument.hasCompletion());
    }

    testAddOption() {
        const command = new Fixtures.TestCommand();
        const ret = command.addOption('foo');
        __self.assertEquals(command, ret, '.addOption() implements a fluent interface');
        __self.assertTrue(command.definition.hasOption('foo'), '.addOption() adds an option to the command');
    }

    testAddOptionFull() {
        const command = new Fixtures.TestCommand();
        command.addOption('foo', [ 'f' ], InputOption.VALUE_OPTIONAL, 'Description', 'default', [ 'a', 'b' ]);

        const option = command.definition.getOption('foo');
        __self.assertSame('f', option.getShortcut());
        __self.assertSame('Description', option.getDescription());
        __self.assertSame('default', option.getDefault());
        __self.assertTrue(option.hasCompletion());
    }

    testSetHidden() {
        const command = new Fixtures.TestCommand();
        command.hidden = true;
        __self.assertTrue(command.hidden);
    }

    testGetNamespaceGetNameSetName() {
        const command = new Fixtures.TestCommand();
        __self.assertEquals('namespace:name', command.name, 'get name() returns the command name');

        command.name = 'foo';
        __self.assertEquals('foo', command.name, 'set name() sets the command name');

        command.name = 'foobar:bar';
        __self.assertEquals('foobar:bar', command.name, 'set name() sets the command name');
    }

    @dataProvider('provideInvalidCommandNames')
    testInvalidCommandNames(name) {
        this.expectException(InvalidArgumentException);
        this.expectExceptionMessage(__jymfony.sprintf('Command name "%s" is invalid.', name));

        const command = new Fixtures.TestCommand();
        command.name = name;
    }

    provideInvalidCommandNames() {
        return [
            [ '' ],
            [ 'foo:' ],
        ];
    }

    testGetSetDescription() {
        const command = new Fixtures.TestCommand();
        __self.assertEquals('description', command.description, 'get description() returns the description');

        command.description = 'description1';
        __self.assertEquals('description1', command.description, 'set description() sets the description');
    }

    testGetSetHelp() {
        const command = new Fixtures.TestCommand();
        __self.assertEquals('help', command.help, 'get help() returns the help');

        command.help = 'help1';
        __self.assertEquals('help1', command.help, 'set help() sets the help');

        command.help = '';
        __self.assertEquals('', command.help, 'get help() does not fall back to the description');
    }

    testGetProcessedHelp() {
        let command = new Fixtures.TestCommand();
        command.help = 'The %command.name% command does... Example: %command.full_name%.';
        __self.assertStringContainsString('The namespace:name command does...', command.processedHelp, 'get processedHelp() replaces %command.name% correctly');
        __self.assertStringNotContainsString('%command.full_name%', command.processedHelp, 'get processedHelp() replaces %command.full_name%');

        command = new Fixtures.TestCommand();
        command.help = '';
        __self.assertStringContainsString('description', command.processedHelp, 'get processedHelp() falls back to the description');

        command = new Fixtures.TestCommand();
        command.help = 'The %command.name% command does... Example: %command.full_name%.';

        const application = new Application();
        application.add(command);
        application.defaultCommand = 'namespace:name';
        application.isSingleCommand = true;

        __self.assertStringContainsString('The namespace:name command does...', command.processedHelp, 'get processedHelp() replaces %command.name% correctly in single command applications');
        __self.assertStringNotContainsString('%command.full_name%', command.processedHelp, 'get processedHelp() replaces %command.full_name% in single command applications');
    }

    testGetSetAliases() {
        const command = new Fixtures.TestCommand();
        __self.assertEquals([ 'name' ], command.aliases, 'get aliases() returns the aliases');

        command.aliases = [ 'name1' ];
        __self.assertEquals([ 'name1' ], command.aliases, 'set aliases() sets the aliases');
    }

    testGetSynopsis() {
        const command = new Fixtures.TestCommand();
        command.addOption('foo');
        command.addArgument('bar');
        command.addArgument('info');
        __self.assertEquals('namespace:name [--foo] [--] [<bar> [<info>]]', command.getSynopsis(), '.getSynopsis() returns the synopsis');
    }

    testAddGetUsages() {
        const command = new Fixtures.TestCommand();
        command.addUsage('foo1');
        command.addUsage('foo2');
        __self.assertStringContainsString('namespace:name foo1', command.usages);
        __self.assertStringContainsString('namespace:name foo2', command.usages);
    }

    testMergeApplicationDefinition() {
        const application1 = new Application();
        application1.definition.addArguments([ new InputArgument('foo', InputArgument.REQUIRED) ]);
        application1.definition.addOptions([ new InputOption('bar') ]);

        const command = new Fixtures.TestCommand();
        command.application = application1;
        command.definition = new InputDefinition([ new InputArgument('bar', InputArgument.REQUIRED), new InputOption('foo') ]);

        command.mergeApplicationDefinition();
        __self.assertTrue(command.definition.hasArgument('foo'), '.mergeApplicationDefinition() merges the application arguments and the command arguments');
        __self.assertTrue(command.definition.hasArgument('bar'), '.mergeApplicationDefinition() merges the application arguments and the command arguments');
        __self.assertTrue(command.definition.hasOption('foo'), '.mergeApplicationDefinition() merges the application options and the command options');
        __self.assertTrue(command.definition.hasOption('bar'), '.mergeApplicationDefinition() merges the application options and the command options');

        command.mergeApplicationDefinition();
        __self.assertEquals(3, command.definition.getArgumentCount(), '->mergeApplicationDefinition() does not try to merge twice the application arguments and options');
    }

    testMergeApplicationDefinitionWithoutArgsThenWithArgsAddsArgs() {
        const application1 = new Application();
        application1.definition.addArguments([ new InputArgument('foo', InputArgument.REQUIRED) ]);
        application1.definition.addOptions([ new InputOption('bar') ]);

        const command = new Fixtures.TestCommand();
        command.application = application1;
        const definition = new InputDefinition([]);
        command.definition = definition;

        command.mergeApplicationDefinition(false);
        __self.assertTrue(command.definition.hasOption('bar'), '.mergeApplicationDefinition(false) merges the application and the command options');
        __self.assertFalse(command.definition.hasArgument('foo'), '.mergeApplicationDefinition(false) does not merge the application arguments');

        command.mergeApplicationDefinition(true);
        __self.assertTrue(command.definition.hasArgument('foo'), '.mergeApplicationDefinition(true) merges the application arguments and the command arguments');

        command.mergeApplicationDefinition();
        __self.assertEquals(2, command.definition.getArgumentCount(), '.mergeApplicationDefinition() does not try to merge twice the application arguments');
    }

    async testRunInteractive() {
        const tester = new CommandTester(new Fixtures.TestCommand());
        await tester.run({}, { interactive: true });

        __self.assertEquals('interact called' + os.EOL + 'execute called' + os.EOL, tester.getDisplay(), '.run() calls the interact() method if the input is interactive');
    }

    async testRunNonInteractive() {
        const tester = new CommandTester(new Fixtures.TestCommand());
        await tester.run({}, { interactive: false });

        __self.assertEquals('execute called' + os.EOL, tester.getDisplay(), '.run() does not call the interact() method if the input is not interactive');
    }

    async testExecuteMethodNeedsToBeOverridden() {
        this.expectException(LogicException);
        this.expectExceptionMessage('You must override the execute() method in the concrete command class.');

        const command = new Command('foo');
        await command.run(new StringInput(''), new NullOutput());
    }

    async testRunWithInvalidOption() {
        this.expectException(InvalidOptionException);
        this.expectExceptionMessage('The "--bar" option does not exist.');

        const command = new Fixtures.TestCommand();
        const tester = new CommandTester(command);
        await tester.run({ '--bar': true });
    }

    async testRunWithApplication() {
        const command = new Fixtures.TestCommand();
        command.application = new Application();
        const exitCode = await command.run(new StringInput(''), new NullOutput());

        __self.assertSame(0, exitCode, '.run() returns an integer exit code');
    }

    async testRunReturnsAlwaysInteger() {
        const command = new Fixtures.TestCommand();
        __self.assertSame(0, await command.run(new StringInput(''), new NullOutput()));
    }

    async testRunWithProcessTitle() {
        const command = new Fixtures.TestCommand();
        command.application = new Application();
        command.processTitle = 'foo';

        __self.assertSame(0, await command.run(new StringInput(''), new NullOutput()));
        __self.assertEquals('foo', process.title);
    }

    async testSetCode() {
        const command = new Fixtures.TestCommand();
        command.code = async function (input, output) {
            output.writeln('from the code...');
        };

        const tester = new CommandTester(command);
        await tester.run({}, { interactive: true });
        __self.assertEquals('interact called' + os.EOL + 'from the code...' + os.EOL, tester.getDisplay());
    }

    testCommandAttribute() {
        __self.assertSame('|foo|f', Fixtures.CommandWithAttribute.getDefaultName());
        __self.assertSame('desc', Fixtures.CommandWithAttribute.getDefaultDescription());

        const command = new Fixtures.CommandWithAttribute();

        __self.assertSame('foo', command.name);
        __self.assertSame('desc', command.description);
        __self.assertTrue(command.hidden);
        __self.assertSame([ 'f' ], command.aliases);
    }
}
