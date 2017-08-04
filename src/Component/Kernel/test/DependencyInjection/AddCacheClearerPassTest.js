const expect = require('chai').expect;

const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const AddCacheClearerPass = Jymfony.Component.Kernel.DependencyInjection.AddCacheClearerPass;

describe('[Kernel] AddCacheClearerPass', function () {
    it('Pass is ignored if no CacheClearer definition', () => {
        let container = {
            hasDefinition: () => false,
            findTaggedServiceIds: () => { throw new Error(); },
            getDefinition: () => { throw new Error(); },
        };

        let pass = new AddCacheClearerPass();
        pass.process(container);
    });

    it ('Pass process', () => {
        let container = new ContainerBuilder();
        let definition = container.register('cache_clearer').setArguments([undefined]);
        container.register('my_cache_clearer_service1')
            .addTag('kernel.cache_clearer')
        ;

        let pass = new AddCacheClearerPass();
        pass.process(container);
        let expected = [
            new Reference('my_cache_clearer_service1'),
        ];

        expect(expected).to.be.deep.equal(definition.getArgument(0));
    });
});
