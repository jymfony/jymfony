const expect = require('chai').expect;
const path = require('path');

const Application = Jymfony.Component.Console.Application;
const Command = Jymfony.Component.Console.Command.Command;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const InputOption = Jymfony.Component.Console.Input.InputOption;

const fixtures_path = path.join(__dirname, '..', '..', 'fixtures');
const Fixtures = new Jymfony.Component.Autoloader.Namespace(__jymfony.autoload, 'Fixtures', [
    fixtures_path,
]);

describe('[Console] Command', function () {
    it('constructor takes command name as first argument', () => {
        let cmd = new Command('foo:bar');
        expect(cmd.name).to.be.equal('foo:bar');
    });

    it('cannot be constructed without name', () => {
        expect(() => new Command).to.throw(
            LogicException,
            'The command defined in "Jymfony.Component.Console.Command.Command" cannot have an empty name.'
        );
    });

    it('application can be set', () => {
        let cmd = new Command('foo:bar');
        let application = new Application;

        cmd.application = application;
        expect(cmd.application).to.be.equal(application);
    });

    it('application can be set to undefined', () => {
        let cmd = new Command('foo:bar');
        cmd.application = undefined;
        expect(cmd.application).to.be.undefined;
    });

    it('definition can be set and get', () => {
        let cmd = new Fixtures.TestCommand();
        let definition;

        cmd.definition = definition = new InputDefinition();
        expect(cmd.definition).to.be.equal(definition);

        cmd.definition = [new InputArgument('foo'), new InputOption('bar')];
        expect(cmd.definition).to.be.instanceOf(InputDefinition);
        expect(cmd.definition.hasArgument('foo')).to.be.true;
        expect(cmd.definition.hasOption('bar')).to.be.true;
    });

    it('argument can be added', () => {
        let cmd = new Fixtures.TestCommand();
        let ret = cmd.addArgument('foo');

        expect(ret).to.be.equal(cmd);
        expect(cmd.definition.hasArgument('foo')).to.be.true;
    });

    it('option can be added', () => {
        let cmd = new Fixtures.TestCommand();
        let ret = cmd.addOption('bar');

        expect(ret).to.be.equal(cmd);
        expect(cmd.definition.hasOption('bar')).to.be.true;
    });

    it('can be set hidden', () => {
        let cmd = new Fixtures.TestCommand();
        cmd.hidden = true;

        expect(cmd.hidden).to.be.true;
    });

    it('name/namespace can be set', () => {
        let cmd = new Fixtures.TestCommand();
        expect(cmd.name).to.be.equal('namespace:name');

        cmd.name = 'foo';
        expect(cmd.name).to.be.equal('foo');

        cmd.name = 'foobar:bar';
        expect(cmd.name).to.be.equal('foobar:bar');
    });

    let tests = [
        '',
        'foo:'
    ];

    for (let [key, name] of __jymfony.getEntries(tests)) {
        it('set invalid name should throw with dataset #'+key, () => {
            let cmd = new Fixtures.TestCommand();
            expect(() => { cmd.name = name; })
                .to.throw(InvalidArgumentException);
        });
    }

    it('description can be set', () => {
        let cmd = new Fixtures.TestCommand();
        cmd.description = 'description1';

        expect(cmd.description).to.be.equal('description1');
    });

    it('help can be set', () => {
        let cmd = new Fixtures.TestCommand();
        cmd.help = 'help1';

        expect(cmd.help).to.be.equal('help1');
    });

    it('help should be processed', () => {
        let cmd = new Fixtures.TestCommand();
        cmd.help = 'The %command.name% command does... Example: %command.full_name%.';
        expect(cmd.processedHelp).to.have.string('The namespace:name command does...');
        expect(cmd.processedHelp).not.to.have.string('%command.full_name%');

        cmd.help = '';
        expect(cmd.processedHelp).to.be.equal('description');
    });

    it('alias can be set', () => {
        let cmd = new Fixtures.TestCommand();
        expect(cmd.aliases).to.be.deep.equal(['name']);

        cmd.aliases = ['name1'];
        expect(cmd.aliases).to.be.deep.equal(['name1']);
    });

    it('set alias throws if argument is not an array', () => {
        let cmd = new Fixtures.TestCommand();
        expect(() => cmd.aliases = undefined)
            .to.throw(InvalidArgumentException);
    });

    it('get synopsis', () => {
        let cmd = new Fixtures.TestCommand();
        cmd.addOption('foo');
        cmd.addArgument('bar');

        expect(cmd.getSynopsis())
            .to.be.equal('namespace:name [--foo] [--] [<bar>]');
    });

    it('usages', () => {
        let cmd = new Fixtures.TestCommand();
        cmd.addUsage('foo1');
        cmd.addUsage('foo2');

        expect(cmd.usages).to.contain('namespace:name foo1');
        expect(cmd.usages).to.contain('namespace:name foo2');
    });
});
