const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const JsDumper = Jymfony.Component.DependencyInjection.Dumper.JsDumper;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
const SecurityExtension = Jymfony.Bundle.SecurityBundle.DependencyInjection.SecurityExtension;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class SecurityExtensionTest extends TestCase {
    container;
    extension;

    get testCaseName() {
        return '[SecurityBundle] ' + super.testCaseName;
    }

    beforeEach() {
        this.container = new ContainerBuilder(new ParameterBag({
            'kernel.debug': true,
            'kernel.root_dir': __dirname,
            'kernel.project_dir': __dirname,
            'kernel.cache_dir': __dirname + '/cache',
        }));
        this.extension = new SecurityExtension();
    }

    afterEach() {
        this.container.compile();
        const dumper = new JsDumper(this.container);
        dumper.dump();
    }

    testShouldRegisterConsoleCommand() {
        this.extension.load([
            {
                firewalls: {
                    main: { anonymous: true },
                },
            },
        ], this.container);

        __self.assertTrue(this.container.hasDefinition('security.command.user_password_encoder'));
    }
}
