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

    it('should register http server configuration', () => {
        this.extension.load([ {
            http_server: {
                enabled: true,
            },
        } ], this.container);

        expect(this.container.hasDefinition(Jymfony.Component.HttpServer.HttpServer)).to.be.true;
    });

    it('should set http request timeout', () => {
        this.extension.load([ {
            http_server: {
                enabled: true,
                request_timeout: 30000,
            },
        } ], this.container);

        expect(this.container.hasDefinition(Jymfony.Component.HttpServer.HttpServer)).to.be.true;
        expect(
            this.container.getDefinition(Jymfony.Component.HttpServer.HttpServer).getProperties()
        ).to.be.deep.equal({ requestTimeoutMs: 30000 });
    });

    it('should set http key and certificate', () => {
        this.extension.load([ {
            http_server: {
                enabled: true,
                key: '/path/to/file.key',
                certificate: '/path/to/certificate.pem',
            },
        } ], this.container);

        expect(this.container.hasDefinition(Jymfony.Component.HttpServer.HttpServer)).to.be.true;

        const def = this.container.getDefinition(Jymfony.Component.HttpServer.HttpServer);
        expect(def.getClass()).to.be.equal('Jymfony.Component.HttpServer.Http2.HttpServer');
    });
});
