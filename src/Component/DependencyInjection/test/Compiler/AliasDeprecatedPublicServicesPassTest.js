const AliasDeprecatedPublicServicesPass = Jymfony.Component.DependencyInjection.Compiler.AliasDeprecatedPublicServicesPass;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const { expect } = require('chai');

describe('[DependencyInjection] Compiler.AliasDeprecatedPublicServicesPass', function () {
    it ('should set deprecation on alias', () => {
        const container = new ContainerBuilder();
        container
            .register('foo')
            .setPublic(true)
            .addTag('container.private', {});

        (new AliasDeprecatedPublicServicesPass()).process(container);

        expect(container.hasAlias('foo')).to.be.true;

        const alias = container.getAlias('foo');
        expect(alias.toString()).to.be.equal('.container.private.foo');
        expect(alias.isPublic()).to.be.true;
        expect(alias.getDeprecationMessage('foo'))
            .to.be.equal('Accessing the "foo" service directly from the container is deprecated, use dependency injection instead.');
    });

    it ('should throw if tag is set on private service', () => {
        const container = new ContainerBuilder();
        container
            .register('foo')
            .setPublic(false)
            .addTag('container.private', {});

        expect(() => (new AliasDeprecatedPublicServicesPass()).process(container))
            .to.throw(InvalidArgumentException, 'The "foo" service is private: it cannot have the "container.private" tag.');
    });
});
