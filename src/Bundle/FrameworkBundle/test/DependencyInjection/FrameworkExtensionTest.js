const FrameworkExtension = Jymfony.Bundle.FrameworkBundle.DependencyInjection.FrameworkExtension;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
const JsDumper = Jymfony.Component.DependencyInjection.Dumper.JsDumper;
const { expect } = require('chai');

describe('[FrameworkBundle] FrameworkExtension', function () {
    beforeEach(() => {
        this.container = new ContainerBuilder(new ParameterBag({
            'kernel.debug': true,
            'kernel.root_dir': __dirname,
            'kernel.project_dir': __dirname,
            'kernel.cache_dir': __dirname + '/cache',
        }));
        this.extension = new FrameworkExtension();
    });

    afterEach(() => {
        this.container.compile();

        const dumper = new JsDumper(this.container);
        dumper.dump();
    });

    it('should register console configuration', () => {
        this.extension.load([
            { console: true },
        ], this.container);

        expect(this.container.hasAlias('console.application')).to.be.true;
        expect(this.container.hasDefinition(Jymfony.Bundle.FrameworkBundle.Console.Application)).to.be.true;
        expect(this.container.hasDefinition('framework.cache_clear_command')).to.be.true;
    });

    it('should register debug configuration', () => {
        this.extension.load([
            { debug: true },
        ], this.container);

        expect(this.container.hasDefinition('var_dumper.cloner')).to.be.true;
    });

    it('should register logger configuration', () => {
        this.extension.load([ {
            logger: {
                handlers: {
                    console: { type: 'console', bubble: false },
                },
            },
        } ], this.container);

        expect(this.container.hasDefinition('jymfony.logger')).to.be.true;
        expect(this.container.hasDefinition('jymfony.logger.handler.console')).to.be.true;
    });
});
