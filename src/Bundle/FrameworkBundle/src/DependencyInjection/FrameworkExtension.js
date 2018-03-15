const Configuration = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Configuration;
const FileLocator = Jymfony.Component.Config.FileLocator;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const Extension = Jymfony.Component.DependencyInjection.Extension.Extension;
const path = require('path');

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.DependencyInjection
 */
class FrameworkExtension extends Extension {
    /**
     * Load a configuration
     *
     * @param {*} configs
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    load(configs, container) {
        const loader = new JsFileLoader(container, new FileLocator(path.join(__dirname, '..', 'Resources', 'config')));
        loader.load('services.js');
        loader.load('commands.js');
        loader.load('http-server.js');
        loader.load('logger.js');

        const configuration = this.getConfiguration(container);
        const config = this._processConfiguration(configuration, configs);

        this._registerRouterConfiguration(config.router, container, loader);
    }

    /**
     * @inheritDoc
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    getConfiguration(container) {
        return new Configuration(container.getParameter('kernel.debug'));
    }

    /**
     * @param {*} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.DependencyInjection.Loader.LoaderInterface} loader
     */
    _registerRouterConfiguration(config, container, loader) {
        if (! this._isConfigEnabled(container, config)) {
            container.removeDefinition('console.command.router_debug');
            container.removeDefinition('console.command.router_match');

            return;
        }

        loader.load('routing.js');

        container.setParameter('router.resource', config['resource']);
        const definition = container.getDefinition('router.default');

        const options = definition.getArgument(3);
        if (config.type) {
            options.resource_type = config.type;
        }

        definition.replaceArgument(3, options);
    }
}

module.exports = FrameworkExtension;
