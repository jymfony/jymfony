import { join } from 'path';

const Configuration = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Configuration;
const CachePoolPass = Jymfony.Component.Cache.DependencyInjection.CachePoolPass;
const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;
const FileLocator = Jymfony.Component.Config.FileLocator;
const Alias = Jymfony.Component.DependencyInjection.Alias;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const Container = Jymfony.Component.DependencyInjection.Container;
const Parameter = Jymfony.Component.DependencyInjection.Parameter;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const Extension = Jymfony.Component.DependencyInjection.Extension.Extension;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.DependencyInjection
 */
export default class FrameworkExtension extends Extension {
    __construct() {
        super.__construct();

        this._sessionConfigEnabled = false;
    }

    /**
     * @inheritdoc
     */
    load(configs, container) {
        const loader = new JsFileLoader(container, new FileLocator(join(__dirname, '..', 'Resources', 'config')));
        loader.load('services.js');

        const configuration = this.getConfiguration(configs, container);
        const config = this._processConfiguration(configuration, configs);

        if (config.test) {
            loader.load('test.js');
        }

        if (! container.hasParameter('debug.file_link_format')) {
            if (! container.hasParameter('templating.helper.code.file_link_format')) {
                const links = {
                    textmate: 'txmt://open?url=file://%%f&line=%%l',
                    macvim: 'mvim://open?url=file://%%f&line=%%l',
                    emacs: 'emacs://open?url=file://%%f&line=%%l',
                    sublime: 'subl://open?url=file://%%f&line=%%l',
                    phpstorm: 'phpstorm://open?file=%%f&line=%%l',
                    atom: 'atom://core/open/file?filename=%%f&line=%%l',
                };

                const ide = config['ide'];
                container.setParameter('templating.helper.code.file_link_format', (links[ide] || ide || '').toString().replace(/%/g, '%%'));
            }

            container.setParameter('debug.file_link_format', '%templating.helper.code.file_link_format%');
        }

        this._registerDebugConfiguration(config.debug, container, loader);
        this._registerSessionConfiguration(config.session, container, loader);
        this._registerConsoleConfiguration(config.console, container, loader);
        this._registerLoggerConfiguration(config.logger, container, loader);
        this._registerRouterConfiguration(config.router, container, loader);
        this._registerHttpServerConfiguration(config.http_server, container, loader);
        this._registerCacheConfiguration(config.cache, container, loader);
        this._registerDevServer(container, loader);
        this._registerMime(loader);
        this._registerTemplatingConfiguration(config.templating, container, loader);

        container.registerForAutoconfiguration('Jymfony.Component.Console.Command.Command').addTag('console.command');
        container.registerForAutoconfiguration('Jymfony.Component.DependencyInjection.ServiceLocator').addTag('container.service_locator');
        container.registerForAutoconfiguration('Jymfony.Component.DependencyInjection.ServiceSubscriberInterface').addTag('container.service_subscriber');
        container.registerForAutoconfiguration('Jymfony.Component.Kernel.CacheClearer.CacheClearerInterface').addTag('kernel.cache_clearer');
        container.registerForAutoconfiguration('Jymfony.Component.Kernel.CacheClearer.CacheWarmerInterface').addTag('kernel.cache_warmer');
        container.registerForAutoconfiguration('Jymfony.Contracts.EventDispatcher.EventSubscriberInterface').addTag('kernel.event_subscriber');

        container.registerForAutoconfiguration('Jymfony.Bundle.FrameworkBundle.Controller.AbstractController')
            .setPublic(true)
            .addTag('controller.service_arguments');

        container.registerForAutoconfiguration('Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface').addTag('controller.argument_value_resolver');
        container.registerForAutoconfiguration('Jymfony.Component.Mime.MimeTypeGuesserInterface').addTag('mime.mime_type_guesser');
        container.registerForAutoconfiguration('Jymfony.Component.Logger.LoggerAwareInterface')
            .addMethodCall('setLogger', [ new Reference('logger') ]);
    }

    /**
     * Returns the extension configuration object.
     *
     * @param {*[]} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     *
     * @returns {Jymfony.Component.Config.Definition.ConfigurationInterface}
     */
    getConfiguration(config, container) {
        return new Configuration(container.getParameter('kernel.debug'));
    }

    _registerSessionConfiguration(config, container, loader) {
        this._sessionConfigEnabled = this._isConfigEnabled(container, config);
        if (! this._sessionConfigEnabled) {
            return;
        }

        loader.load('session.js');
        container.getDefinition(Jymfony.Component.HttpServer.EventListener.SessionListener).replaceArgument(1, config.storage_id);
        container.getDefinition(config.storage_id).replaceArgument(0, config);
    }

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
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
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
     *
     * @private
     */
    _registerDebugConfiguration(config, container, loader) {
        if (! this._isConfigEnabled(container, config)) {
            return;
        }

        if (ReflectionClass.exists('Jymfony.Component.Stopwatch.Stopwatch')) {
            loader.load('debug.js');

            if (ReflectionClass.exists('Jymfony.Component.HttpServer.Debug.TraceableEventDispatcher')) {
                container.getDefinition('debug.event_dispatcher')
                    .setClass(Jymfony.Component.HttpServer.Debug.TraceableEventDispatcher);
            }
        }

        if (ReflectionClass.exists('Jymfony.Component.HttpServer.Controller.ArgumentResolvers.NotTaggedControllerValueResolver')) {
            container.register('argument_resolver.not_tagged_controller', Jymfony.Component.HttpServer.Controller.ArgumentResolvers.NotTaggedControllerValueResolver)
                .addArgument()
                .addTag('controller.argument_value_resolver', {priority: -200});
        }

        if (ReflectionClass.exists('Jymfony.Component.VarDumper.VarDumper')) {
            loader.load('var_dumper.js');

            container.getDefinition('var_dumper.cloner')
                .addProperty('maxItems', config.dump.max_items)
                .addProperty('minDepth', config.dump.min_depth)
                .addProperty('maxString', config.dump.max_string_length)
            ;
        }
    }

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
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
            handlersToChannels[serviceId] = handler.channels;
        }

        const definition = (new ChildDefinition('jymfony.logger_prototype'))
            .setPublic(false)
            .replaceArgument(0, 'app')
            .addTag('kernel.event_subscriber')
        ;

        container.setParameter('jymfony.logger.handlers_to_channels', handlersToChannels);
        container.setDefinition('jymfony.logger', definition);
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} name
     * @param {*} handler
     *
     * @returns {string}
     *
     * @private
     */
    _buildLoggerHandler(container, name, handler) {
        const handlerId = 'jymfony.logger.handler.'+name;
        if ('service' === handler.type) {
            container.setAlias(handlerId, handler.id);

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

            case 'slack':
                definition.setArguments([
                    {
                        token: handler.token,
                        channel: handler.channel,
                        username: handler.bot_name,
                        useAttachment: handler.use_attachment,
                        icon: handler.icon_emoji,
                        shortAttachment: handler.use_short_attachment,
                        includeContextAndExtra: handler.include_extra,
                    },
                    handler.level,
                    handler.bubble,
                ]);
                break;

            case 'slack_webhook':
                definition.setArguments([
                    {
                        webhookUrl: handler.webhook_url,
                        channel: handler.channel,
                        username: handler.bot_name,
                        useAttachment: handler.use_attachment,
                        icon: handler.icon_emoji,
                        shortAttachment: handler.use_short_attachment,
                        includeContextAndExtra: handler.include_extra,
                    },
                    handler.level,
                    handler.bubble,
                ]);
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
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
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
        container.setParameter('router.cache_class_prefix', container.getParameter('kernel.container_class'));
        const definition = container.getDefinition('router.default');

        const options = definition.getArgument(2);
        if (config.type) {
            options.resource_type = config.type;
        }

        definition.replaceArgument(2, options);

        container.register('routing.loader.annotation', Jymfony.Bundle.FrameworkBundle.Routing.AnnotatedControllerLoader)
            .addTag('routing.loader', { priority: -10 })
        ;

        container.register('routing.loader.annotation.namespace', Jymfony.Component.Routing.Loader.NamespaceLoader)
            .addTag('routing.loader', { priority: -10 })
            .setArguments([
                new Reference('routing.loader.annotation'),
            ])
        ;
    }

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
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

        if (config.request_timeout) {
            container.getDefinition(Jymfony.Component.HttpServer.HttpServer)
                .addProperty('requestTimeoutMs', config.request_timeout);
        }

        if (config.key && config.certificate) {
            container.getDefinition(Jymfony.Component.HttpServer.HttpServer)
                .setClass(Jymfony.Component.HttpServer.Http2.HttpServer)
                .addArgument({
                    key: config.key,
                    cert: config.certificate,
                });
        }
    }

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
     *
     * @private
     */
    _registerCacheConfiguration(config, container, loader) {
        loader.load('cache.js');

        const version = new Parameter('container.build_id');
        container.getDefinition('cache.adapter.system').replaceArgument(2, version);
        container.getDefinition('cache.adapter.filesystem').replaceArgument(2, config.directory);

        if (config.prefix_seed) {
            container.setParameter('cache.prefix.seed', config.prefix_seed);
        }

        if (container.hasParameter('cache.prefix.seed')) {
            // Inline any env vars referenced in the parameter
            container.setParameter('cache.prefix.seed', container.parameterBag.resolveValue(container.getParameter('cache.prefix.seed'), true));
        }

        for (let name of [ 'redis'/* , 'memcached' */ ]) {
            if (config[name = 'default_' + name + '_provider']) {
                container.setAlias('cache.' + name, new Alias(CachePoolPass.getServiceProvider(container, config[name]), false));
            }
        }

        for (const name of [ 'app', 'system' ]) {
            config.pools['cache.' + name] = {
                adapter: config[name],
                'public': true,
            };
        }

        for (const [ name, pool ] of __jymfony.getEntries(config.pools)) {
            const definition = new ChildDefinition(pool.adapter);
            definition.setPublic(pool['public']);

            delete pool.adapter;
            delete pool['public'];

            definition.addTag('cache.pool', pool);
            container.setDefinition(name, definition);
        }
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
     *
     * @private
     */
    _registerDevServer(container, loader) {
        if (! ReflectionClass.exists('Jymfony.Component.DevServer.DevServer')) {
            return;
        }

        loader.load('dev-server.js');
    }

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
     *
     * @private
     */
    _registerTemplatingConfiguration(config, container, loader) {
        if (! this._isConfigEnabled(container, config)) {
            return;
        }

        if (! ReflectionClass.exists('Jymfony.Component.Templating.Engine.JsEngine')) {
            throw new LogicException('Templating support cannot be enabled as the Templating component is not installed. Try running "yarn add @jymfony/templating".');
        }

        loader.load('templating.js');

        if (container.getParameter('kernel.debug')) {
            const logger = new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE);

            container.getDefinition('templating.loader.chain')
                .addTag('jymfony.logger', { channel: 'templating' })
                .addMethodCall('setLogger', [ logger ]);
        }

        if (0 !== Object.keys(config.loaders).length) {
            const loaders = Object.values(config.loaders).map((loader) => new Reference(loader));

            // Use a delegation unless only a single loader was registered
            if (1 === loaders.length) {
                container.setAlias('templating.loader', loaders[0].toString()).setPublic(false);
            } else {
                container.getDefinition('templating.loader.chain').addArgument(loaders);
                container.setAlias('templating.loader', 'templating.loader.chain').setPublic(false);
            }
        } else {
            container.register('templating.loader', Jymfony.Component.Templating.Loader.Loader)
                .addArgument([]);
        }

        const engines = config.engines.map((engine) => new Reference('templating.engine.'+engine));

        // Use a delegation unless only a single engine was registered
        if (1 === engines.length) {
            container.setAlias('templating', engines[0].toString()).setPublic(true);
        } else {
            const templateEngineDefinition = container.getDefinition('templating.engine.delegating');
            for (const engine of engines) {
                templateEngineDefinition.addMethodCall('addEngine', [ engine ]);
            }

            container.setAlias('templating', 'templating.engine.delegating').setPublic(true);
        }

        container.setAlias(Jymfony.Component.Templating.Engine.EngineInterface, 'templating');

        // Configure the js engine if needed
        if (-1 !== config.engines.indexOf('js')) {
            loader.load('templating_js.js');
        }
    }

    /**
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
     *
     * @private
     */
    _registerMime(loader) {
        if (! ReflectionClass.exists('Jymfony.Component.Mime.MimeTypes')) {
            return;
        }

        loader.load('mime.js');
    }
}
