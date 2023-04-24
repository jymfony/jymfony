const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const UnusedTagsPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.UnusedTagsPass;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class UnusedTagsPassTest extends TestCase {
    testProcess() {
        const pass = new UnusedTagsPass();
        const container = new ContainerBuilder();

        container.register('foo').addTag('kenrel.event_subscriber');
        container.register('bar').addTag('kenrel.event_subscriber');

        pass.process(container);

        __self.assertEquals([ __jymfony.sprintf(
            '%s: Tag "kenrel.event_subscriber" was defined on service(s) "foo", "bar", but was never used. Did you mean "kernel.event_subscriber"?',
            ReflectionClass.getClassName(UnusedTagsPass)
        ) ], container.getCompiler().getLogs());
    }
}
