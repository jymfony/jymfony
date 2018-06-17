const Configuration = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Configuration;
const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;
const FileLocator = Jymfony.Component.Config.FileLocator;
const Alias = Jymfony.Component.DependencyInjection.Alias;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const Extension = Jymfony.Component.DependencyInjection.Extension.Extension;
const path = require('path');

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.DependencyInjection
 */
class FrameworkExtension extends Extension {
    /**
     * @inheritdoc
     */
    load(configs, container) {
        const loader = new JsFileLoader(container, new FileLocator(path.join(__dirname, '..', 'Resources', 'config')));
        loader.load('services.js');

        const configuration = this.getConfiguration(container);
        const config = this._processConfiguration(configuration, configs);

        if (config.test) {
            loader.load('test.js');
        }

        this._registerConsoleConfiguration(config.console, container, loader);
        this._registerLoggerConfiguration(config.logger, container, loader);
        this._registerRouterConfiguration(config.router, container, loader);
        this._registerHttpServerConfiguration(config.http_server, container, loader);
    }

    /**
     * Returns the extension configuration object.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     *
     * @returns {Jymfony.Component.Config.Definition.ConfigurationInterface}
     */
    getConfiguration(container) {
        return new Configuration(container.getParameter('kernel.debug'));
    }

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.DependencyInjection.Loader.LoaderInterface} loader
     *
     * @private
     */
    _registerConsoleConfiguration(config, container, loader) {
        if (! this._isConfigEnabled(container, config)) {
            return;
        }

        if (! ReflectionClass.exists('Jymfony.Component.Console.Application')) {
            throw new InvalidConfigurationException('Console component is not installed');
        }

        loader.load('console.js');
    }

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.DependencyInjection.Loader.LoaderInterface} loader
     *
     * @private
     */
    _registerLoggerConfiguration(config, container, loader) {
        if (! this._isConfigEnabled(container, config) || ! config.handlers) {
            return;
        }

        if (! ReflectionClass.exists('Jymfony.Component.Logger.Logger')) {
            throw new InvalidConfigurationException('Logger component is not installed');
        }

        loader.load('logger.js');

        const handlers = new PriorityQueue();
        const handlersToChannels = {};
        for (const [ name, handler ] of __jymfony.getEntries(config.handlers)) {
            const serviceId = this._buildLoggerHandler(container, name, handler);
            handlers.push(new Reference(serviceId), handler.priority);

            if (undefined === handler.channels) {
                continue;
            }

            handlersToChannels[serviceId] = handler.channels;
        }

        const definition = (new ChildDefinition('jymfony.logger_prototype'))
            .setPublic(false)
            .replaceArgument(0, 'app')
        ;

        container.setParameter('jymfony.logger.handlers_to_channels', handlersToChannels);
        container.setDefinition('jymfony.logger', definition);
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} name
     * @param {PriorityQueue} handler
     *
     * @returns {string}
     *
     * @private
     */
    _buildLoggerHandler(container, name, handler) {
        const handlerId = 'jymfony.logger.handler.'+name;
        if ('service' === handler.type) {
            container.setAlias(handler, handler.id);

            return handlerId;
        }

        const definition = new ChildDefinition('jymfony.logger.handler_prototype.'+handler.type);
        handler.level = isNumber(handler.level) ? handler.level : Jymfony.Component.Logger.LogLevel[handler.level.toUpperCase()];

        switch (handler.type) {
            case 'stream':
                definition.setArguments([
                    handler.path,
                    handler.level,
                    handler.bubble,
                    handler.file_permission,
                ]);
                break;

            case 'console':
                definition.setArguments([
                    undefined,
                    handler.bubble,
                    handler.verbosity_levels,
                ]);
                definition.addTag('kernel.event_subscriber');
                break;

            case 'mongodb':
                definition.setArguments([
                    new Reference('jymfony.logger.mongodb.connection.'+name),
                    handler.mongo.collection,
                    handler.level,
                    handler.bubble,
                ]);

                if (!!handler.mongo.id) {
                    container.setAlias('jymfony.logger.mongodb.connection.'+name, new Alias(handler.mongo.id));
                } else {
                    container.register('jymfony.logger.mongodb.connection.'+name)
                        .setModule('mongodb', 'MongoClient')
                        .setArguments([
                            handler.mongo.url,
                            {
                                auto_reconnect: false,
                            },
                        ])
                        .setPublic(true)
                    ;
                }
                break;

            case 'null':
                definition.setArguments([
                    handler.level,
                    handler.bubble,
                ]);
                break;

            default:
                throw new InvalidArgumentException(
                    __jymfony.sprintf('Invalid handler type "%s" given for handler "%s"', handler.type, name)
                );
        }

        if (handler.formatter) {
            definition.addProperty('formatter', new Reference(handler.formatter));
        }

        container.setDefinition(handlerId, definition);

        return handlerId;
    }

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.DependencyInjection.Loader.LoaderInterface} loader
     *
     * @private
     */
    _registerRouterConfiguration(config, container, loader) {
        if (! this._isConfigEnabled(container, config)) {
            container.removeDefinition('console.command.router_debug');
            container.removeDefinition('console.command.router_match');

            return;
        }

        if (! ReflectionClass.exists('Jymfony.Component.Routing.RouterInterface')) {
            throw new InvalidConfigurationException('Router component is not installed');
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

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.DependencyInjection.Loader.LoaderInterface} loader
     *
     * @private
     */
    _registerHttpServerConfiguration(config, container, loader) {
        if (! this._isConfigEnabled(container, config)) {
            return;
        }

        if (! ReflectionClass.exists('Jymfony.Component.HttpServer.HttpServer')) {
            throw new InvalidConfigurationException('HttpServer component is not installed');
        }

        loader.load('http-server.js');
    }
}

module.exports = FrameworkExtension;
