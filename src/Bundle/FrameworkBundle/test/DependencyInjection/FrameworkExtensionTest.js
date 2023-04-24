const FrameworkExtension = Jymfony.Bundle.FrameworkBundle.DependencyInjection.FrameworkExtension;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
const JsDumper = Jymfony.Component.DependencyInjection.Dumper.JsDumper;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class FrameworkExtensionTest extends TestCase {
    _container;
    _extension;

    get testCaseName() {
        return '[FrameworkExtension] ' + super.testCaseName;
    }

    beforeEach() {
        this._container = new ContainerBuilder(new ParameterBag({
            'kernel.debug': true,
            'kernel.root_dir': __dirname,
            'kernel.project_dir': __dirname,
            'kernel.cache_dir': __dirname + '/cache',
            'kernel.bundles_metadata': {},
        }));
        this._extension = new FrameworkExtension();
    }

    afterEach() {
        this._container.compile();

        const dumper = new JsDumper(this._container);
        dumper.dump();
    }

    testShouldRegisterConsoleConfiguration() {
        this._extension.load([
            { console: true },
        ], this._container);

        __self.assertTrue(this._container.hasAlias('console.application'));
        __self.assertTrue(this._container.hasDefinition(Jymfony.Bundle.FrameworkBundle.Console.Application));
        __self.assertTrue(this._container.hasDefinition('framework.cache_clear_command'));
    }

    testShouldRegisterDebugConfiguration() {
        this._extension.load([
            { debug: true },
        ], this._container);

        __self.assertTrue(this._container.hasDefinition('var_dumper.cloner'));
    }

    testShouldRegisterLoggerConfiguration() {
        this._extension.load([ {
            logger: {
                handlers: {
                    console: { type: 'console', bubble: false },
                },
            },
        } ], this._container);

        __self.assertTrue(this._container.hasDefinition('jymfony.logger'));
        __self.assertTrue(this._container.hasDefinition('jymfony.logger.handler.console'));
    }

    testShouldRegisterHttpServerConfiguration() {
        this._extension.load([ {
            http_server: {
                enabled: true,
            },
        } ], this._container);

        __self.assertTrue(this._container.hasDefinition(Jymfony.Component.HttpServer.HttpServer));
    }

    testShouldSetHttpServerRequestTimeout() {
        this._extension.load([ {
            http_server: {
                enabled: true,
                request_timeout: 30000,
            },
        } ], this._container);

        __self.assertTrue(this._container.hasDefinition(Jymfony.Component.HttpServer.HttpServer));
        __self.assertEquals({ requestTimeoutMs: 30000 }, this._container.getDefinition(Jymfony.Component.HttpServer.HttpServer).getProperties());
    }

    testShouldSetHttpKeyAndCertificate() {
        this._extension.load([ {
            http_server: {
                enabled: true,
                key: '/path/to/file.key',
                certificate: '/path/to/certificate.pem',
            },
        } ], this._container);

        __self.assertTrue(this._container.hasDefinition(Jymfony.Component.HttpServer.HttpServer));

        const def = this._container.getDefinition(Jymfony.Component.HttpServer.HttpServer);
        __self.assertEquals('Jymfony.Component.HttpServer.Http2.HttpServer', def.getClass());
    }
}
