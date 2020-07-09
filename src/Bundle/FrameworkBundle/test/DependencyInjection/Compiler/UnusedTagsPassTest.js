const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const UnusedTagsPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.UnusedTagsPass;
const { expect } = require('chai');

describe('[FrameworkBundle] UnusedTagsPass', function () {
    it('should push logs into container builder', () => {
        const pass = new UnusedTagsPass();
        const container = new ContainerBuilder();

        container.register('foo').addTag('kenrel.event_subscriber');
        container.register('bar').addTag('kenrel.event_subscriber');

        pass.process(container);

        expect(container.getCompiler().getLogs()).to.be.deep.equal([ __jymfony.sprintf(
            '%s: Tag "kenrel.event_subscriber" was defined on service(s) "foo", "bar", but was never used. Did you mean "kernel.event_subscriber"?',
            ReflectionClass.getClassName(UnusedTagsPass)
        ) ]);
    });
});
