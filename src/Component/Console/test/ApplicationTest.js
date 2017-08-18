const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const os = require('os');
const stream = require('stream');
const fixtures_path = path.join(__dirname, '..', 'fixtures');

const Application = Jymfony.Component.Console.Application;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const ArgvInput = Jymfony.Component.Console.Input.ArgvInput;
const ArrayInput = Jymfony.Component.Console.Input.ArrayInput;
const NullOutput = Jymfony.Component.Console.Output.NullOutput;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const ApplicationTester = Jymfony.Component.Console.Tester.ApplicationTester;
const Fixtures = new Jymfony.Component.Autoloader.Namespace(__jymfony.autoload, 'Fixtures', [
    fixtures_path,
]);

const normalize = str => str.replace(new RegExp(os.EOL, 'g'), '\n');

/**
 * Replaces the dynamic placeholders of the command help text with a static version.
 * The placeholder %command.full_name% includes the script path that is not predictable
 * and can not be tested against.
 *
 * @type {Jymfony.Component.Console.Application} application
 */
const ensureStaticCommandHelp = (application) => {
    for (let command of Object.values(application.all())) {
        command.help = command.help.replace(/%command\.full_name%/g, 'app/console %command.name%');
    }
};

describe('[Console] Application', function () {
    it('constructor', () => {
        let application = new Application('foo', 'bar');
        expect(application.name).to.be.equal('foo');
        expect(application.version).to.be.equal('bar');
        expect(application.all()).to.have.all.keys('list', 'help');
    });

    it('should get/set name', () => {
        let application = new Application();
        application.name = 'foo';

        expect(application.name).to.be.equal('foo');
    });

    it('should get/set version', () => {
        let application = new Application();
        application.version = 'bar';

        expect(application.version).to.be.equal('bar');
    });

    it('should get long version', () => {
        let application = new Application('foo', 'bar');
        expect(application.getLongVersion()).to.be.equal('foo <info>bar</info>');
    });

    it('should have default long version', () => {
        let application = new Application();
        expect(application.getLongVersion()).to.be.equal('Console Tool');
    });

    it('all should return all commands', () => {
        let application = new Application();
        let commands = application.all();

        expect(commands.help).to.be.instanceOf(Jymfony.Component.Console.Command.HelpCommand);
        expect(commands.list).to.be.instanceOf(Jymfony.Component.Console.Command.ListCommand);

        application.add(new Fixtures.FooCommand());
        expect(Object.keys(application.all('foo'))).to.have.lengthOf(1);
    });

    it('register should return a command', () => {
        let application = new Application();
        let command = application.register('foo');

        expect(command).to.be.instanceOf(Jymfony.Component.Console.Command.Command);
        expect(command.name).to.be.equal('foo');
    });

    it('add should work', () => {
        let foo, application = new Application();
        application.add(foo = new Fixtures.FooCommand);

        expect(foo.name).to.be.equal('foo:bar');
        expect(foo === application.all()['foo:bar']).to.be.true;
    });

    it('add command with empty constructor should throw', () => {
        let application = new Application();
        expect(application.add.bind(application, new Fixtures.Foo5Command)).to.throw(
            LogicException,
            'Command class "Fixtures.Foo5Command" is not correctly initialized. You probably forgot to call the parent constructor.'
        );
    });

    it('has get should work', () => {
        let application = new Application();
        expect(application.has('list')).to.be.true;
        expect(application.has('afoobar')).to.be.false;

        let foo = new Fixtures.FooCommand();
        application.add(foo);
        expect(application.has('afoobar')).to.be.true;
        expect(application.get('foo:bar') === foo).to.be.true;
        expect(application.get('afoobar') === foo).to.be.true;
    });

    it('get with help should work', () => {
        let application = new Application();
        let foo = new Fixtures.FooCommand();
        application.add(foo);

        application._wantHelps = true;
        expect(application.get('foo:bar')).to.be.instanceOf(Jymfony.Component.Console.Command.HelpCommand);
    });

    it('silent help should not write to output', () => {
        let application = new Application();
        application.autoExit = false;
        let tester = new ApplicationTester(application);
        return tester.run({'-h': true, '-q': true}, { decorated: false })
            .then(code => {
                expect(code).to.be.equal(0);
                expect(tester.getDisplay()).to.be.empty;

                return code;
            });
    });

    it('invalid command get should throw', () => {
        let application = new Application();
        expect(application.get.bind(application, 'foofoo'))
            .to.throw(Jymfony.Component.Console.Exception.CommandNotFoundException, 'The command "foofoo" does not exist.')
    });

    it('get namespaces should work', () => {
        let application = new Application();
        application.add(new Fixtures.Foo1Command());
        application.add(new Fixtures.FooCommand());

        expect(application.namespaces).to.be.deep.equal(['foo']);
    });

    it('findNamespace should resolve abbreviations', () => {
        let application = new Application();
        application.add(new Fixtures.FooCommand());
        expect(application.findNamespace('foo')).to.be.equal('foo');
        expect(application.findNamespace('f')).to.be.equal('foo');

        application.add(new Fixtures.Foo2Command());
        expect(application.findNamespace('foo')).to.be.equal('foo');
    });

    it('findNamespace should work with subnamespaces', () => {
        let application = new Application();
        application.add(new Fixtures.FooSubnamespaced1Command());
        application.add(new Fixtures.FooSubnamespaced2Command());

        expect(application.findNamespace('foo')).to.be.equal('foo');
    });

    it('findNamespace should throw on ambiguous namespace', () => {
        let application = new Application();
        application.add(new Fixtures.FooCommand);
        application.add(new Fixtures.Foo2Command);
        application.add(new Fixtures.BarBucCommand);

        expect(application.findNamespace.bind(application, 'f')).to.throw(
            Jymfony.Component.Console.Exception.CommandNotFoundException,
            'The namespace "f" is ambiguous.\nDid you mean one of these?\n    foo\n    foo1'
        );
    });

    it('findNamespace should throw on invalid namespace', () => {
        let application = new Application();

        expect(application.findNamespace.bind(application, 'bar')).to.throw(
            Jymfony.Component.Console.Exception.CommandNotFoundException,
            'There are no commands defined in the "bar" namespace.'
        );
    });

    it('find should not match namespace name', () => {
        let application = new Application();
        application.add(new Fixtures.Foo2Command());

        expect(application.find.bind(application, 'foo1'))
            .to.throw(Jymfony.Component.Console.Exception.CommandNotFoundException, 'Command "foo1" is not defined');
    });

    it('find should work', () => {
        let application = new Application();
        application.add(new Fixtures.FooCommand());

        expect(application.find('foo:bar')).to.be.instanceOf(Fixtures.FooCommand);
        expect(application.find('h')).to.be.instanceOf(Jymfony.Component.Console.Command.HelpCommand);
        expect(application.find('f:bar')).to.be.instanceOf(Fixtures.FooCommand);
        expect(application.find('f:b')).to.be.instanceOf(Fixtures.FooCommand);
        expect(application.find('a')).to.be.instanceOf(Fixtures.FooCommand); // Abbreviation of alias
    });

    let ambiguousAbbreviations = function * () {
        yield ['f', 'Command "f" is not defined.'];
        yield ['a',
            'Command "a" is ambiguous.\nDid you mean one of these?\n' +
            '    afoobar  The foo:bar command\n' +
            '    afoobar1 The foo:bar1 command\n' +
            '    afoobar2 The foo1:bar command'
        ];
        yield ['foo:b',
            'Command "foo:b" is ambiguous.\nDid you mean one of these?\n' +
            '    foo:bar  The foo:bar command\n' +
            '    foo:bar1 The foo:bar1 command\n' +
            '    foo1:bar The foo1:bar command'
        ];
    };

    for (let [abbrev, message] of ambiguousAbbreviations()) {
        it('find with ambiguous name should throw', () => {
            let application = new Application();
            application.add(new Fixtures.FooCommand());
            application.add(new Fixtures.Foo1Command());
            application.add(new Fixtures.Foo2Command());

            expect(application.find.bind(application, abbrev))
                .to.throw(Jymfony.Component.Console.Exception.CommandNotFoundException, message);
        });
    }

    it('find should select command when name is equal to a namespace', () => {
        let application = new Application();
        application.add(new Fixtures.Foo3Command());
        application.add(new Fixtures.Foo4Command());

        expect(application.find('foo3:bar')).to.be.instanceOf(Fixtures.Foo3Command);
        expect(application.find('foo3:bar:toh')).to.be.instanceOf(Fixtures.Foo4Command);
    });

    it('find should select command with ambiguous namespace but equal name', () => {
        let application = new Application();
        application.add(new Fixtures.FooCommand());
        application.add(new Fixtures.FoobarCommand());

        expect(application.find('f:f')).to.be.instanceOf(Fixtures.FoobarCommand);
    });

    it('find should select command with missing namespace', () => {
        let application = new Application();
        application.add(new Fixtures.Foo4Command());

        expect(application.find('f::t')).to.be.instanceOf(Fixtures.Foo4Command);
    });

    let invalidCommandNamesSingle = function * () {
        yield 'foo3:baR';
        yield 'foO3:bar';
    };

    for (let name of invalidCommandNamesSingle()) {
        it('find with invalid command name should throw and return correct exception message', () => {
            let application = new Application();
            application.add(new Fixtures.Foo3Command());

            expect(application.find.bind(application, name)).to.throw(
                Jymfony.Component.Console.Exception.CommandNotFoundException,
                /Did you mean this/
            );
        });
    }

    it('find with invalid command name should throw and return correct exception message multiple', () => {
        let application = new Application();
        application.add(new Fixtures.FooCommand());
        application.add(new Fixtures.Foo1Command());
        application.add(new Fixtures.Foo2Command());

        expect(application.find.bind(application, 'foo:baR'))
            .to.throw(
                Jymfony.Component.Console.Exception.CommandNotFoundException,
                /Did you mean one of these/
            )
            .that.match(/foo1:bar/)
            .that.match(/foo:bar/)
        ;

        expect(application.find.bind(application, 'foo2:bar'))
            .to.throw(
                Jymfony.Component.Console.Exception.CommandNotFoundException,
                /Did you mean one of these/
            )
            .that.match(/foo1/)
        ;

        application.add(new Fixtures.Foo3Command());
        application.add(new Fixtures.Foo4Command());

        expect(application.find.bind(application, 'foo3'))
            .to.throw(
                Jymfony.Component.Console.Exception.CommandNotFoundException,
                /Did you mean one of these/
            )
            .that.match(/foo3:bar/)
            .that.match(/foo3:bar:toh/)
        ;
    });

    it('find with invalid command name should throw and proposes alternatives', () => {
        let application = new Application();
        application.add(new Fixtures.FooCommand());
        application.add(new Fixtures.Foo1Command());
        application.add(new Fixtures.Foo2Command());

        let commandName = 'Unknown command';
        expect(application.find.bind(application, commandName))
            .to.throw(
                Jymfony.Component.Console.Exception.CommandNotFoundException,
                'Command "' + commandName + '" is not defined.'
            )
            .that.has.property('alternatives').that.is.deep.equal([]);

        commandName = 'bar1';
        expect(application.find.bind(application, commandName))
            .to.throw(
                Jymfony.Component.Console.Exception.CommandNotFoundException,
                'Command "' + commandName + '" is not defined.'
            )
            .that.match(/afoobar1/)
            .that.match(/foo:bar1/)
            .that.has.property('alternatives').that.is.deep.equal(['afoobar1', 'foo:bar1'])
        ;
    });

    it('find should return correct command with alias', () => {
        let command = new Fixtures.FooCommand();
        command.aliases = ['foo2'];

        let application = new Application();
        application.add(command);

        expect(application.find('foo') === command).to.be.true;
    });

    it('find with invalid namespace should throw', () => {
        let application = new Application();
        application.add(new Fixtures.FooCommand());
        application.add(new Fixtures.Foo1Command());
        application.add(new Fixtures.Foo2Command());
        application.add(new Fixtures.Foo3Command());

        expect(application.find.bind(application, 'Unknown-namespace:Unknown-command'))
            .to.throw(
                Jymfony.Component.Console.Exception.CommandNotFoundException,
                'There are no commands defined in the "Unknown-namespace" namespace.'
            )
            .that.has.property('alternatives').that.is.deep.equal([])
        ;
    });

    it('find should throw with alternatives', () => {
        let application = new Application();
        application.add(new Fixtures.FooCommand());
        application.add(new Fixtures.Foo1Command());
        application.add(new Fixtures.Foo2Command());
        application.add(new Fixtures.Foo3Command());

        let expectedAlternatives = [
            'afoobar',
            'afoobar1',
            'afoobar2',
            'foo1:bar',
            'foo3:bar',
            'foo:bar',
            'foo:bar1',
        ];

        expect(application.find.bind(application, 'foo'))
            .to.throw(
                Jymfony.Component.Console.Exception.CommandNotFoundException,
                /Command "foo" is not defined\.[.\s]*Did you mean one of these\?[.\s]*/
            )
            .that.has.property('alternatives').that.is.deep.equal(expectedAlternatives)
        ;
    });

    it('renderException should work', () => {
        let application = new Application();
        application.autoExit = false;
        delete process.env.COLUMNS;

        let tester = new ApplicationTester(application);
        return __jymfony.Async.run(function * () {
            yield tester.run({'command': 'foo'}, {decorated: false, stderr: true});
            expect(tester.getErrorDisplay(true))
                .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_renderexception1.txt'), { encoding: 'utf-8' }));

            yield tester.run({'command': 'foo'}, {decorated: false, verbosity: OutputInterface.VERBOSITY_VERBOSE, stderr: true});
            expect(tester.getErrorDisplay(true)).to.match(/Exception trace/);

            yield tester.run({'command': 'list', '--foo': true}, {decorated: false, stderr: true});
            expect(tester.getErrorDisplay(true))
                .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_renderexception2.txt'), { encoding: 'utf-8' }));

            application.add(new Fixtures.Foo3Command());
            yield tester.run({'command': 'foo3:bar'}, {decorated: false, stderr: true});
            expect(tester.getErrorDisplay(true))
                .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_renderexception3.txt'), { encoding: 'utf-8' }));

            yield tester.run({'command': 'foo3:bar'}, {decorated: false, verbosity: OutputInterface.VERBOSITY_VERBOSE, stderr: true});
            let err = tester.getErrorDisplay(true);
            expect(err).to.match(/\[Exception]\s*First exception/);
            expect(err).to.match(/\[Exception]\s*Second exception/);
            expect(err).to.match(/\[Exception \(404\)]\s*Third exception/);
        });
    });

    it('renderException should escape lines', () => {
        let application = new Application();
        application.autoExit = false;
        process.env.COLUMNS = 22;

        application.register('foo').execute = () => {
            throw new Exception('dont break here <info>!</info>');
        };

        let tester = new ApplicationTester(application);
        return __jymfony.Async.run(function * () {
            yield tester.run({'command': 'foo'}, {decorated: false});
            try {
                expect(tester.getDisplay(true))
                    .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_renderexception_escapeslines.txt'), {encoding: 'utf-8'}));
            } finally {
                delete process.env.COLUMNS;
            }
        });
    });

    it('run should work', () => {
        let command, application = new Application();
        application.autoExit = false;
        application.add(command = new Fixtures.Foo1Command());

        return __jymfony.Async.run(function * () {
            let prevArgv = process.argv;
            process.argv = ['node', 'cli.js', 'foo:bar1'];

            yield application.run();

            process.argv = prevArgv;

            expect(command.input).to.be.instanceOf(Jymfony.Component.Console.Input.ArgvInput);
            expect(command.output).to.be.instanceOf(Jymfony.Component.Console.Output.ConsoleOutput);

            application = new Application();
            application.autoExit = false;
            ensureStaticCommandHelp(application);
            let tester = new ApplicationTester(application);

            yield tester.run({}, {decorated: false});
            expect(tester.getDisplay(true))
                .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_run1.txt'), { encoding: 'utf-8' }));

            yield tester.run({'--help': true}, {decorated: false});
            expect(tester.getDisplay(true))
                .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_run2.txt'), { encoding: 'utf-8' }));

            yield tester.run({'-h': true}, {decorated: false});
            expect(tester.getDisplay(true))
                .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_run2.txt'), { encoding: 'utf-8' }));

            yield tester.run({'command': 'list', '--help': true}, {decorated: false});
            expect(tester.getDisplay(true))
                .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_run3.txt'), { encoding: 'utf-8' }));

            yield tester.run({'command': 'list', '-h': true}, {decorated: false});
            expect(tester.getDisplay(true))
                .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_run3.txt'), { encoding: 'utf-8' }));

            yield tester.run({'command': 'list', '--quiet': true}, {decorated: false});
            expect(tester.getDisplay(true)).to.be.equal('');
            expect(tester.input.interactive).to.be.false;

            yield tester.run({'command': 'list', '-q': true}, {decorated: false});
            expect(tester.getDisplay(true)).to.be.equal('');
            expect(tester.input.interactive).to.be.false;

            application = new Application();
            application.autoExit = false;
            application.add(new Fixtures.FooCommand());

            tester = new ApplicationTester(application);
            yield tester.run({'command': 'foo:bar', '--no-interaction': true}, {decorated: false});
            expect(tester.getDisplay()).to.be.equal('called'+os.EOL);

            yield tester.run({'command': 'foo:bar', '-n': true}, {decorated: false});
            expect(tester.getDisplay()).to.be.equal('called'+os.EOL);
        });
    });

    it('verbosity should be set correctly', () => {
        return __jymfony.Async.run(function * () {
            let application = new Application();
            application.autoExit = false;
            ensureStaticCommandHelp(application);
            let tester = new ApplicationTester(application);

            yield tester.run({'command': 'list', '--verbose': true}, {decorated: false});
            expect(tester.output.verbosity).to.be.equal(OutputInterface.VERBOSITY_VERBOSE);

            yield tester.run({'command': 'list', '--verbose': 1}, {decorated: false});
            expect(tester.output.verbosity).to.be.equal(OutputInterface.VERBOSITY_VERBOSE);

            yield tester.run({'command': 'list', '--verbose': 2}, {decorated: false});
            expect(tester.output.verbosity).to.be.equal(OutputInterface.VERBOSITY_VERY_VERBOSE);

            yield tester.run({'command': 'list', '--verbose': 3}, {decorated: false});
            expect(tester.output.verbosity).to.be.equal(OutputInterface.VERBOSITY_DEBUG);

            yield tester.run({'command': 'list', '--verbose': 4}, {decorated: false});
            expect(tester.output.verbosity).to.be.equal(OutputInterface.VERBOSITY_VERBOSE);

            yield tester.run({'command': 'list', '-v': true}, {decorated: false});
            expect(tester.output.verbosity).to.be.equal(OutputInterface.VERBOSITY_VERBOSE);

            yield tester.run({'command': 'list', '-vv': 2}, {decorated: false});
            expect(tester.output.verbosity).to.be.equal(OutputInterface.VERBOSITY_VERY_VERBOSE);

            yield tester.run({'command': 'list', '-vvv': 3}, {decorated: false});
            expect(tester.output.verbosity).to.be.equal(OutputInterface.VERBOSITY_DEBUG);
        });
    });

    it('version options should work', () => {
        return __jymfony.Async.run(function * () {
            let application = new Application();
            application.autoExit = false;
            ensureStaticCommandHelp(application);
            let tester = new ApplicationTester(application);

            yield tester.run({'--version': true}, { decorated: false });
            expect(tester.getDisplay(true))
                .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_run4.txt'), { encoding: 'utf-8' }));

            yield tester.run({'-V': true}, { decorated: false });
            expect(tester.getDisplay(true))
                .to.be.equal(fs.readFileSync(path.join(fixtures_path, 'application_run4.txt'), { encoding: 'utf-8' }));
        });
    });

    it('ansi/no-ansi options should work', () => {
        return __jymfony.Async.run(function * () {
            let application = new Application();
            application.autoExit = false;
            ensureStaticCommandHelp(application);
            let tester = new ApplicationTester(application);

            yield tester.run({'--ansi': true});
            expect(tester.output.decorated).to.be.true;

            yield tester.run({'--no-ansi': true});
            expect(tester.output.decorated).to.be.false;
        });
    });

    it('verbosity flag should not break argument', () => {
        let application = new Application();
        application.autoExit = false;
        application.add(new Fixtures.FooCommand());

        let output = new NullOutput(new stream.PassThrough());

        return __jymfony.Async.run(function * () {
            let input = new ArgvInput(['node', 'cli', '--verbose', 'foo:bar']);
            let code = yield application.run(input, output);
            expect(code).to.be.equal(0);

            input = new ArgvInput(['node', 'cli', '-v', 'foo:bar']);
            code = yield application.run(input, output);
            expect(code).to.be.equal(0);
        });
    });

    it('should return exit code', () => {
        let application = new Application();
        application.autoExit = false;
        application._doRun = function * () {
            throw new Exception('', 4);
        };

        return __jymfony.Async.run(function * () {
            let code = yield application.run(undefined, new NullOutput());
            expect(code).to.be.equal(4);
        })
    });

    it('should return exit code 1 when exception code is 0', () => {
        let application = new Application();
        application.autoExit = false;
        application._doRun = function * () {
            throw new Exception('', 0);
        };

        return __jymfony.Async.run(function * () {
            let code = yield application.run(undefined, new NullOutput());
            expect(code).to.be.equal(1);
        })
    });

    it('should throw trying to add option with duplicate shortcut', ReflectionClass.exists('Jymfony.Component.EventDispatcher.EventDispatcher') ? () => {
        let eventDispatcher = new Jymfony.Component.EventDispatcher.EventDispatcher();
        let application = new Application();
        application.autoExit = false;
        application.catchExceptions = false;
        application.dispatcher = eventDispatcher;
        application.definition.addOption(new InputOption('env', 'e', InputOption.VALUE_REQUIRED, 'Environment'));

        let command = application.register('foo');
        command.execute = () => {};
        command.addOption('survey', 'e', InputOption.VALUE_NONE, 'e shortcut');

        return __jymfony.Async.run(function * () {
            let ex;
            try {
                yield application.run(new ArrayInput({command: 'foo'}), new NullOutput());
            } catch (e) {
                ex = e;
            }

            expect(ex)
                .to.be.instanceOf(LogicException)
                .that.has.property('message')
                .that.equals('An option with shortcut "e" already exists.');
        });

    } : undefined);

    let tests = function * () {
        yield ['duplicate command', new InputArgument('command', InputArgument.REQUIRED)];
        yield ['duplication option', new InputOption('quiet', '', InputOption.VALUE_NONE)];
        yield ['duplication shortcut', new InputOption('query', 'q', InputOption.VALUE_REQUIRED)];
    };

    for (let [key, def] of tests()) {
        it('should throw on adding already set definition #'+key, () => {
            let application = new Application();
            application.autoExit = false;
            application.catchExceptions = false;
            let command = application.register('foo');
            command.definition = [def];
            command.execute = () => {};

            return __jymfony.Async.run(function * () {
                let ex;

                try {
                    yield application.run(new ArrayInput({'command': 'foo'}), new NullOutput());
                } catch (e) {
                    ex = e;
                }

                expect(ex).to.be.instanceOf(LogicException);
            });
        });
    }
});
