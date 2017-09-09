const expect = require('chai').expect;
const path = require("path");

const Application = Jymfony.Bundle.FrameworkBundle.Console.Application;
const Namespace = Jymfony.Component.Autoloader.Namespace;
const Kernel = Jymfony.Component.Kernel.Kernel;

Jymfony.Bundle.FrameworkBundle.Tests = new Namespace(__jymfony.autoload, 'Jymfony.Bundle.FrameworkBundle.Tests');
Jymfony.Bundle.FrameworkBundle.Tests.Fixtures = new Jymfony.Component.Autoloader.Namespace(
    __jymfony.autoload,
    'Jymfony.FrameworkBundle.Tests.Fixtures',
    [ path.join(__dirname, '..', '..', 'fixtures') ]
);

const TestKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.TestKernel;

describe('[FrameworkBundle] Application', function () {
    this.timeout(Infinity);

    it('constructor', () => {
        let kernel = new TestKernel('test', true, false);
        kernel.registerBundles = () => [];

        let application = new Application(kernel);

        expect(application.kernel).to.be.equal(kernel);
    });

    it('find', () => {
        let kernel = new TestKernel('test', true, true);
        kernel.registerBundles = () => [];

        let application = new Application(kernel);

        let command = application.find('my:command:foo');

        expect(kernel.container.get('command_1')).to.be.equal(command);
    });

    it('get', () => {
        let kernel = new TestKernel('test', true, true);
        kernel.registerBundles = () => [];

        let application = new Application(kernel);

        let command = application.get('my:command:bar');

        expect(kernel.container.get('command_2')).to.be.equal(command);
    });

    it('all', () => {
        let kernel = new TestKernel('test', true, true);
        kernel.registerBundles = () => [];

        let application = new Application(kernel);

        let commands = application.all('my:command');

        expect(kernel.container.get('command_1')).to.be.equal(commands['my:command:foo']);
        expect(kernel.container.get('command_2')).to.be.equal(commands['my:command:bar']);
    });

    it('getLongVersion', () => {
        let kernel = new TestKernel('test', true, true);
        kernel.registerBundles = () => [];

        let application = new Application(kernel);
        let expected = `Jymfony <info>${Kernel.VERSION}</info> (kernel: <comment>fixtures</comment>, env: <comment>test</comment>, debug: <comment>true</comment>)`;

        expect(application.getLongVersion()).to.be.equal(expected);
    });
});
