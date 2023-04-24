const Application = Jymfony.Bundle.FrameworkBundle.Console.Application;
const Kernel = Jymfony.Component.Kernel.Kernel;
const TestKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.TestKernel;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class ApplicationTest extends TestCase {
    get testCaseName() {
        return '[FrameworkBundle] ' + super.testCaseName;
    }

    testConstructor() {
        const kernel = new TestKernel('test', true, false);
        const application = new Application(kernel);

        __self.assertEquals(kernel, application.kernel);
    }

    async testFind() {
        const kernel = new TestKernel('test', true, true);
        await kernel.boot();
        const application = kernel.container.get('console.application');

        const command = application.find('my:command:foo');

        __self.assertSame(command, kernel.container.get('command_1'));
    }

    async testGet() {
        const kernel = new TestKernel('test', true, true);
        await kernel.boot();
        const application = kernel.container.get('console.application');

        const command = application.get('my:command:bar');

        __self.assertSame(command, kernel.container.get('command_2'));
    }

    async testAll() {
        const kernel = new TestKernel('test', true, true);
        await kernel.boot();
        const application = kernel.container.get('console.application');

        const commands = application.all('my:command');

        __self.assertSame(commands['my:command:foo'], kernel.container.get('command_1'));
        __self.assertSame(commands['my:command:bar'], kernel.container.get('command_2'));
    }

    async testGetLongVersion() {
        const kernel = new TestKernel('test', true, true);
        await kernel.boot();
        const application = kernel.container.get('console.application');
        const expected = `Jymfony <info>${Kernel.VERSION}</info> (kernel: <comment>fixtures</comment>, env: <comment>test</comment>, debug: <comment>true</comment>)`;

        __self.assertEquals(expected, application.getLongVersion());
    }
}
