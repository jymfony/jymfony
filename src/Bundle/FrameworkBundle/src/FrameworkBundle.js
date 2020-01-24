const Bundle = Jymfony.Component.Kernel.Bundle;
const PassConfig = Jymfony.Component.DependencyInjection.Compiler.PassConfig;
const RegisterListenerPass = Jymfony.Component.EventDispatcher.DependencyInjection.Compiler.RegisterListenerPass;
const Compiler = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler;
const CachePoolPass = Jymfony.Component.Cache.DependencyInjection.CachePoolPass;
const ClassExistenceResource = Jymfony.Component.Config.Resource.ClassExistenceResource;
const AddConsoleCommandPass = Jymfony.Component.Console.DependencyInjection.AddConsoleCommandPass;

/**
 * FrameworkBundle.
 *
 * @memberOf Jymfony.Bundle.FrameworkBundle
 */
export default class FrameworkBundle extends Bundle {
    /**
     * @inheritDoc
     */
    async boot() {
        if (this._container.has('mime_types')) {
            Jymfony.Component.Mime.MimeTypes.instance = this._container.get('mime_types');
        }

        if (this._container.has('var_dumper.cloner')) {
            const container = this._container;

            Jymfony.Component.VarDumper.VarDumper.setHandler((variable) => {
                const dumper = new Jymfony.Component.VarDumper.Dumper.CliDumper();
                const cloner = container.get('var_dumper.cloner');

                const handler = (variable) => {
                    dumper.dump(cloner.cloneVar(variable));
                };

                Jymfony.Component.VarDumper.VarDumper.setHandler(handler);
                handler(variable);
            });
        }
    }

    /**
     * @inheritdoc
     */
    build(container) {
        container
            .addCompilerPass(new AddConsoleCommandPass())
            .addCompilerPass(new RegisterListenerPass(), PassConfig.TYPE_BEFORE_REMOVING)
            .addCompilerPass(new Compiler.LoggerChannelPass())
            .addCompilerPass(new Compiler.LoggerAddProcessorsPass())
        ;

        this._addCompilerPassIfExists(container, 'Jymfony.Component.HttpServer.DependencyInjection.RegisterControllerArgumentLocatorsPass');
        this._addCompilerPassIfExists(container, 'Jymfony.Component.HttpServer.DependencyInjection.RemoveEmptyControllerArgumentLocatorsPass', PassConfig.TYPE_BEFORE_REMOVING);
        this._addCompilerPassIfExists(container, 'Jymfony.Component.HttpServer.DependencyInjection.ControllerArgumentValueResolverPass');

        container
            .addCompilerPass(new Compiler.TestServiceContainerWeakRefPass(), PassConfig.TYPE_BEFORE_REMOVING, -32)
            .addCompilerPass(new Compiler.TestServiceContainerRealRefPass(), PassConfig.TYPE_AFTER_REMOVING)
            .addCompilerPass(new CachePoolPass(), PassConfig.TYPE_BEFORE_OPTIMIZATION, 32)
        ;

        this._addCompilerPassIfExists(container, 'Jymfony.Component.Routing.DependencyInjection.RoutingResolverPass');
        this._addCompilerPassIfExists(container, 'Jymfony.Component.Mime.DependencyInjection.AddMimeTypeGuesserPass');
    }

    /**
     * Adds a compiler pass if class exists.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} pass
     * @param {string} [type = Jymfony.Component.DependencyInjection.Compiler.PassConfig.TYPE_BEFORE_OPTIMIZATION]
     * @param {int} [priority = 0]
     */
    _addCompilerPassIfExists(container, pass, type = PassConfig.TYPE_BEFORE_OPTIMIZATION, priority = 0) {
        container.addResource(new ClassExistenceResource(pass));

        if (ReflectionClass.exists(pass)) {
            const reflector = new ReflectionClass(pass);
            container.addCompilerPass(reflector.newInstance(), type, priority);
        }
    }
}
