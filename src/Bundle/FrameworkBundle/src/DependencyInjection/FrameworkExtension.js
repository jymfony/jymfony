import { join } from 'path';
import { statSync } from 'fs';

const Alias = Jymfony.Component.DependencyInjection.Alias;
const CachePoolPass = Jymfony.Component.Cache.DependencyInjection.CachePoolPass;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const Configuration = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Configuration;
const Container = Jymfony.Component.DependencyInjection.Container;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const DirectoryResource = Jymfony.Component.Config.Resource.DirectoryResource;
const Extension = Jymfony.Component.DependencyInjection.Extension.Extension;
const FileLocator = Jymfony.Component.Config.FileLocator;
const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const Parameter = Jymfony.Component.DependencyInjection.Parameter;
const ServiceLocatorTagPass = Jymfony.Component.DependencyInjection.Compiler.ServiceLocatorTagPass;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.DependencyInjection
 */
export default class FrameworkExtension extends Extension {
    __construct() {
        super.__construct();

        this._sessionConfigEnabled = false;
        this._validatorConfigEnabled = false;
        this._messengerConfigEnabled = false;
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
                    webstorm: 'webstorm://open?file=%%f&line=%%l',
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
        this._registerValidationConfiguration(config.validation, container, loader);

        // Messenger depends on validation being registered
        if (this._messengerConfigEnabled = this._isConfigEnabled(container, config.messenger)) {
            this._registerMessengerConfiguration(config.messenger, container, loader, config.validation);
        } else {
            container.removeDefinition('cache.messenger.restart_workers_signal');
        }

        this._registerHttpClientConfiguration(config.http_client, container, loader, { enabled: false } /* config.profiler */);

        container.registerForAutoconfiguration('Jymfony.Component.Console.Command.Command').addTag('console.command');
        container.registerForAutoconfiguration('Jymfony.Component.DependencyInjection.ServiceLocator').addTag('container.service_locator');
        container.registerForAutoconfiguration('Jymfony.Component.DependencyInjection.ServiceSubscriberInterface').addTag('container.service_subscriber');
        container.registerForAutoconfiguration('Jymfony.Component.Kernel.CacheClearer.CacheClearerInterface').addTag('kernel.cache_clearer');
        container.registerForAutoconfiguration('Jymfony.Component.Kernel.CacheClearer.CacheWarmerInterface').addTag('kernel.cache_warmer');
        container.registerForAutoconfiguration('Jymfony.Contracts.EventDispatcher.EventSubscriberInterface').addTag('kernel.event_subscriber');
        container.registerForAutoconfiguration('Jymfony.Component.Validator.ConstraintValidatorInterface').addTag('validator.constraint_validator');

        container.registerForAutoconfiguration('Jymfony.Bundle.FrameworkBundle.Controller.AbstractController')
            .setPublic(true)
            .addTag('controller.service_arguments');

        container.registerForAutoconfiguration('Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface').addTag('controller.argument_value_resolver');
        container.registerForAutoconfiguration('Jymfony.Component.Mime.MimeTypeGuesserInterface').addTag('mime.mime_type_guesser');
        container.registerForAutoconfiguration('Jymfony.Component.Messenger.Transport.TransportFactoryInterface').addTag('messenger.transport_factory');
        container.registerForAutoconfiguration('Jymfony.Component.Messenger.Handler.MessageHandlerInterface').addTag('messenger.message_handler');
        container.registerForAutoconfiguration('Jymfony.Contracts.Logger.LoggerAwareInterface')
            .addMethodCall('setLogger', [ new Reference('logger', ContainerBuilder.IGNORE_ON_INVALID_REFERENCE) ]);

        container.registerAnnotationForAutoconfiguration('Jymfony.Component.Console.Annotation.AsCommand', (definition) => {
            definition.addTag('console.command');
        });

        container.registerAnnotationForAutoconfiguration('Jymfony.Component.EventDispatcher.Annotation.EventListener', (definition, annotation, reflector) => {
            if (reflector instanceof ReflectionClass) {
                definition.addTag('kernel.event_listener', {
                    event: annotation.event,
                    method: annotation.method,
                    priority: annotation.priority,
                });
            } else if (reflector instanceof ReflectionMethod) {
                definition.addTag('kernel.event_listener', {
                    event: annotation.event,
                    method: reflector.name,
                    priority: annotation.priority,
                });
            }
        });
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
        container.getDefinition(Jymfony.Component.HttpServer.EventListener.SessionListener)
            .replaceArgument(1, config.storage_id)
            .replaceArgument(2, config.cookie_lifetime)
            .replaceArgument(3, config.cookie_path)
            .replaceArgument(4, config.cookie_domain)
            .replaceArgument(5, config.cookie_secure)
            .replaceArgument(6, config.cookie_httponly)
        ;
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

        const debug = container.getParameter('kernel.debug');
        if (debug && ReflectionClass.exists('Jymfony.Bundle.FrameworkBundle.Log.Processor.DebugProcessor')) {
            container.register('debug.log_processor', 'Jymfony.Bundle.FrameworkBundle.Log.Processor.DebugProcessor')
                .setPublic(false)
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
        handler.level = isNumber(handler.level) ? handler.level : Jymfony.Contracts.Logger.LogLevel[handler.level.toUpperCase()];

        switch (handler.type) {
            case 'stream':
                definition.setArguments({
                    index_0: handler.path,
                    index_1: handler.level,
                    index_2: handler.bubble,
                    index_3: handler.file_permission,
                });
                break;

            case 'console':
                definition.setArguments({
                    index_0: undefined,
                    index_1: handler.bubble,
                    index_2: handler.verbosity_levels,
                });
                definition.addTag('kernel.event_subscriber');
                break;

            case 'mongodb':
                definition.setArguments({
                    index_0: new Reference('jymfony.logger.mongodb.connection.' + name),
                    index_1: handler.mongo.collection,
                    index_2: handler.level,
                    index_3: handler.bubble,
                });

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
                definition.setArguments({
                    index_0: {
                        token: handler.token,
                        channel: handler.channel,
                        username: handler.bot_name,
                        useAttachment: handler.use_attachment,
                        icon: handler.icon_emoji,
                        shortAttachment: handler.use_short_attachment,
                        includeContextAndExtra: handler.include_extra,
                    },
                    index_1: handler.level,
                    index_2: handler.bubble,
                });
                break;

            case 'slack_webhook':
                definition.setArguments({
                    index_0: {
                        webhookUrl: handler.webhook_url,
                        channel: handler.channel,
                        username: handler.bot_name,
                        useAttachment: handler.use_attachment,
                        icon: handler.icon_emoji,
                        shortAttachment: handler.use_short_attachment,
                        includeContextAndExtra: handler.include_extra,
                    },
                    index_1: handler.level,
                    index_2: handler.bubble,
                });
                break;

            case 'null':
                definition.setArguments({
                    index_0: handler.level,
                    index_1: handler.bubble,
                });
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
            .addArgument('%kernel.environment%')
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

        loader.load('error-renderer.js');
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

    _registerHttpClientConfiguration(config, container, loader, profilerConfig) {
        if (! this._isConfigEnabled(container, config)) {
            return;
        }

        loader.load('http-client.js');

        const options = config.default_options || {};
        const retryOptions = options.retry_failed || { enabled: false };
        delete options.retry_failed;

        container.getDefinition('http_client').setArguments([ options, config.max_host_connections || 6 ]);
        if (this._isConfigEnabled(container, retryOptions)) {
            this._registerRetryableHttpClient(retryOptions, 'http_client', container);
        }

        const httpClientId = (retryOptions.enabled || false) ? 'http_client.retryable.inner' : (this._isConfigEnabled(container, profilerConfig) ? '.debug.http_client.inner' : 'http_client');
        for (const [ name, scopeConfig ] of __jymfony.getEntries(config.scoped_clients)) {
            const ScopingHttpClient = Jymfony.Component.HttpClient.ScopingHttpClient;

            if ('http_client' === name) {
                throw new InvalidArgumentException(__jymfony.sprintf('Invalid scope name: "%s" is reserved.', name));
            }

            const scope = scopeConfig.scope || null;
            delete scopeConfig.scope;

            const retryOptions = scopeConfig.retry_failed || { enabled: false };
            delete scopeConfig.retry_failed;

            if (null === scope) {
                const baseUri = scopeConfig.base_uri;
                delete scopeConfig.base_uri;

                container.register(name, ScopingHttpClient)
                    .setFactory('Jymfony.Component.HttpClient.ScopingHttpClient#forBaseUri')
                    .setArguments([ new Reference(httpClientId), baseUri, scopeConfig ])
                    .addTag('http_client.client')
                ;
            } else {
                container.register(name, ScopingHttpClient)
                    .setArguments([ new Reference(httpClientId), { scope: scopeConfig }, scope ])
                    .addTag('http_client.client')
                ;
            }

            if (this._isConfigEnabled(container, retryOptions)) {
                this._registerRetryableHttpClient(retryOptions, name, container);
            }
        }

        const responseFactoryId = config.mock_response_factory || null;
        if (responseFactoryId) {
            container.register(httpClientId + '.mock_client', Jymfony.Component.HttpClient.MockHttpClient)
                .setDecoratedService(httpClientId, null, -10) // Lower priority than TraceableHttpClient
                .setArguments([ new Reference(responseFactoryId) ]);
        }
    }

    _registerRetryableHttpClient(options, name, container) {
        let retryStrategy;
        if (null !== options.retry_strategy) {
            retryStrategy = new Reference(options['retry_strategy']);
        } else {
            retryStrategy = new ChildDefinition('http_client.abstract_retry_strategy');
            const codes = {};
            for (const [ code, codeOptions ] of options.http_codes) {
                if (codeOptions.methods) {
                    codes[code] = codeOptions.methods;
                } else {
                    codes[code] = true;
                }
            }

            retryStrategy
                .replaceArgument(0, 0 < Object.keys(codes).length ? codes : GenericRetryStrategy.DEFAULT_RETRY_STATUS_CODES)
                .replaceArgument(1, options.delay)
                .replaceArgument(2, options.multiplier)
                .replaceArgument(3, options.max_delay);
            container.setDefinition(name + '.retry_strategy', retryStrategy);

            retryStrategy = new Reference(name + '.retry_strategy');
        }

        container
            .register(name + '.retryable', 'Jymfony.Component.HttpClient.RetryableHttpClient')
            .setDecoratedService(name, null, 10) // Higher priority than TraceableHttpClient
            .setArguments([ new Reference(name + '.retryable.inner'), retryStrategy, options.max_retries, new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
            .addTag('jymfony.logger', { channel: 'http_client' });
    }

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
     *
     * @private
     */
    _registerValidationConfiguration(config, container, loader) {
        if (! (this._validatorConfigEnabled = this._isConfigEnabled(container, config))) {
            return;
        }

        if (! ReflectionClass.exists('Jymfony.Component.Validator.Validation')) {
            throw new LogicException('Validation support cannot be enabled as the Validator component is not installed. Try running "yarn add @jymfony/validator".');
        }

        if (undefined === config.email_validation_mode) {
            config.email_validation_mode = 'loose';
        }

        loader.load('validator.js');

        const validatorBuilder = container.getDefinition('validator.builder');
        container.setParameter('validator.translation_domain', config.translation_domain);

        const files = { json: [], yaml: [] };
        this._registerValidatorMapping(container, config, files);

        if (0 !== files.json.length) {
            validatorBuilder.addMethodCall('addJsonMappings', [ files.json ]);
        }

        if (0 !== files.yaml.length) {
            validatorBuilder.addMethodCall('addYamlMappings', [ files.yaml ]);
        }

        const definition = container.findDefinition('validator.email');
        definition.replaceArgument(0, config.email_validation_mode);

        if (config.enable_decorators) {
            validatorBuilder.addMethodCall('enableAnnotationMapping');
        }

        if (undefined !== config.static_method) {
            for (const methodName of config.static_method) {
                validatorBuilder.addMethodCall('addMethodMapping', [ methodName ]);
            }
        }

        if (! container.getParameter('kernel.debug')) {
            validatorBuilder.addMethodCall('setMappingCache', [ new Reference('validator.mapping.cache.adapter') ]);
        }

        // Container
        //     .getDefinition('validator.not_compromised_password')
        //     .setArgument(2, config.not_compromised_password.enabled)
        //     .setArgument(3, config.not_compromised_password.endpoint)
        // ;
    }

    /**
     * @param {Object} config
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.Loader.LoaderInterface} loader
     * @param {Object} validationConfig
     *
     * @private
     */
    _registerMessengerConfiguration(config, container, loader, validationConfig) {
        if (!ReflectionClass.exists('Jymfony.Component.Messenger.MessageBusInterface')) {
            throw new LogicException('Messenger support cannot be enabled as the Messenger component is not installed. Try running "npm install @jymfony/messenger".');
        }

        loader.load('messenger.js');

        if (null === config.default_bus && 1 === Object.keys(config.buses).length) {
            config.default_bus = Object.keys(config.buses)[0];
        }

        const defaultMiddleware = {
            before: [
                { id: 'add_bus_name_stamp_middleware' },
                // { id: 'reject_redelivered_message_middleware' },
                { id: 'dispatch_after_current_bus' },
                { id: 'failed_message_processing_middleware' },
            ],
            after: [
                { id: 'send_message' },
                { id: 'handle_message' },
            ],
        };

        for (const [ busId, bus ] of __jymfony.getEntries(config.buses)) {
            let middleware = bus.middleware;

            if (!! bus.default_middleware) {
                if ('allow_no_handlers' === bus.default_middleware) {
                    defaultMiddleware.after[1].arguments = [ true ];
                } else {
                    delete defaultMiddleware.after[1].arguments;
                }

                // Argument to add_bus_name_stamp_middleware
                defaultMiddleware.before[0].arguments = [ busId ];
                middleware = [ ...defaultMiddleware.before, ...middleware, ...defaultMiddleware.after ];
            }

            for (const middlewareItem of middleware) {
                if (! validationConfig.enabled && [ 'validation', 'messenger.middleware.validation' ].includes(middlewareItem.id)) {
                    throw new LogicException('The Validation middleware is only available when the Validator component is installed and enabled. Try running "npm install @jymfony/validator".');
                }
            }

            if (container.getParameter('kernel.debug') && ReflectionClass.exists('Jymfony.Component.Stopwatch.Stopwatch')) {
                middleware.unshift({ id: 'traceable', arguments: [ busId ] });
            } else {
                container.removeDefinition('messenger.middleware.traceable');
            }

            container.setParameter(busId + '.middleware', middleware);
            container.register(busId, 'Jymfony.Component.Messenger.MessageBus').addArgument([]).addTag('messenger.bus');

            if (busId === config.default_bus) {
                container.setAlias('messenger.default_bus', busId).setPublic(true);
                container.setAlias('Jymfony.Component.Messenger.MessageBusInterface', busId);
            }
        }

        if (0 === config.transports.length) {
            container.removeDefinition('messenger.transport.amqp.factory');
            container.removeDefinition('messenger.transport.redis.factory');
            container.removeDefinition('messenger.transport.sqs.factory');
            container.removeDefinition('messenger.transport.beanstalkd.factory');
            container.removeAlias('Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface');
        } else {
            container.setAlias('messenger.default_serializer', config.serializer.default_serializer);
        }

        const failureTransports = [];
        if (!! config.failure_transport) {
            if (! config.transports[config.failure_transport]) {
                throw new LogicException(__jymfony.sprintf('Invalid Messenger configuration: the failure transport "%s" is not a valid transport or service id.', config.failure_transport));
            }

            container.setAlias('messenger.failure_transports.default', 'messenger.transport.' + config.failure_transport);
            failureTransports.push(config.failure_transport);
        }

        const failureTransportsByName = {};
        for (const [ name, transport ] of __jymfony.getEntries(config.transports)) {
            if (!! transport.failure_transport) {
                failureTransports.push(transport.failure_transport);
                failureTransportsByName[name] = transport.failure_transport;
            } else if (!! config.failure_transport) {
                failureTransportsByName[name] = config.failure_transport;
            }
        }

        const senderAliases = {};
        const transportRetryReferences = {};
        for (const [ name, transport ] of __jymfony.getEntries(config.transports)) {
            const serializerId = transport.serializer || 'messenger.default_serializer';
            const transportDefinition = new Definition('Jymfony.Component.Messenger.Transport.TransportInterface')
                .setFactory([ new Reference('messenger.transport_factory'), 'createTransport' ])
                .setArguments([ transport.dsn, Object.assign({}, transport.options, { transport_name: name }), new Reference(serializerId) ])
                .addTag('messenger.receiver', {
                    alias: name,
                    is_failure_transport: failureTransports.includes(name),
                });

            const transportId = 'messenger.transport.' + name;
            container.setDefinition(transportId, transportDefinition);
            senderAliases[name] = transportId;

            if (!! transport.retry_strategy.service) {
                transportRetryReferences[name] = new Reference(transport.retry_strategy.service);
            } else if ('exponential' === transport.retry_strategy.strategy) {
                const retryServiceId = __jymfony.sprintf('messenger.retry.multiplier_retry_strategy.%s', name);
                const retryDefinition = new ChildDefinition('messenger.retry.abstract_multiplier_retry_strategy');
                retryDefinition
                    .replaceArgument(0, transport.retry_strategy.max_retries)
                    .replaceArgument(1, transport.retry_strategy.delay)
                    .replaceArgument(2, transport.retry_strategy.multiplier)
                    .replaceArgument(3, transport.retry_strategy.max_delay);
                container.setDefinition(retryServiceId, retryDefinition);

                transportRetryReferences[name] = new Reference(retryServiceId);
            } else if ('fixed' !== transport.retry_strategy.strategy) {
                const retryServiceId = __jymfony.sprintf('messenger.retry.fixed_retry_strategy.%s', name);
                const retryDefinition = new ChildDefinition('messenger.retry.abstract_multiplier_retry_strategy');
                retryDefinition
                    .replaceArgument(0, transport.retry_strategy.max_retries)
                    .replaceArgument(1, transport.retry_strategy.delay)
                    .replaceArgument(2, 1)
                    .replaceArgument(3, 0);
                container.setDefinition(retryServiceId, retryDefinition);

                transportRetryReferences[name] = new Reference(retryServiceId);
            }
        }

        const senderReferences = {};
        // Alias => service_id
        for (const [ alias, serviceId ] of __jymfony.getEntries(senderAliases)) {
            senderReferences[alias] = new Reference(serviceId);
        }
        // Service_id => service_id
        for (const serviceId of Object.values(senderAliases)) {
            senderReferences[serviceId] = new Reference(serviceId);
        }

        for (const transport of Object.values(config.transports)) {
            if (!! transport.failure_transport) {
                if (! senderReferences[transport.failure_transport]) {
                    throw new LogicException(__jymfony.sprintf('Invalid Messenger configuration: the failure transport "%s" is not a valid transport or service id.', transport.failure_transport));
                }
            }
        }

        const failureTransportReferencesByTransportName = Object.values(failureTransportsByName).map(failureTransportName => senderReferences[failureTransportName]);
        const messageToSendersMapping = {};
        for (const [ message, messageConfiguration ] of __jymfony.getEntries(config.routing)) {
            if ('*' !== message && ! ReflectionClass.exists(message)) {
                throw new LogicException(__jymfony.sprintf('Invalid Messenger routing configuration: class or interface "%s" not found.', message));
            }

            // Make sure senderAliases contains all senders
            for (const sender of messageConfiguration.senders) {
                if (!senderReferences[sender]) {
                    throw new LogicException(__jymfony.sprintf('Invalid Messenger routing configuration: the "%s" class is being routed to a sender called "%s". This is not a valid transport or service id.', message, sender));
                }
            }

            messageToSendersMapping[message] = messageConfiguration.senders;
        }

        const sendersServiceLocator = ServiceLocatorTagPass.register(container, senderReferences);

        container.getDefinition('messenger.senders_locator')
            .replaceArgument(0, messageToSendersMapping)
            .replaceArgument(1, sendersServiceLocator)
        ;

        // Container.getDefinition('messenger.retry.send_failed_message_for_retry_listener')
        //     .replaceArgument(0, sendersServiceLocator)
        // ;

        container
            .getDefinition('messenger.retry_strategy_locator')
            .replaceArgument(0, transportRetryReferences);

        if (0 < failureTransports.length) {
            container.getDefinition('console.command.messenger_failed_messages_retry')
                .replaceArgument(0, config.failure_transport);
            container.getDefinition('console.command.messenger_failed_messages_show')
                .replaceArgument(0, config.failure_transport);
            container.getDefinition('console.command.messenger_failed_messages_remove')
                .replaceArgument(0, config.failure_transport);

            const failureTransportsByTransportNameServiceLocator = ServiceLocatorTagPass.register(container, failureTransportReferencesByTransportName);
            container.getDefinition('messenger.failure.send_failed_message_to_failure_transport_listener')
                .replaceArgument(0, failureTransportsByTransportNameServiceLocator);
        } else {
            container.removeDefinition('messenger.failure.send_failed_message_to_failure_transport_listener');
            container.removeDefinition('console.command.messenger_failed_messages_retry');
            container.removeDefinition('console.command.messenger_failed_messages_show');
            container.removeDefinition('console.command.messenger_failed_messages_remove');
        }
    }


    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Object} config
     * @param {{ yaml: string[], json: string[] }} files
     * @private
     */
    _registerValidatorMapping(container, config, files) {
        const fileRecorder = (extension, path) => {
            files['yml' === extension ? 'yaml' : extension].push(path);
        };

        const isDir = path => {
            try {
                const s = statSync(path);

                return s.isDirectory();
            } catch (e) {
                return false;
            }
        };

        const registerMappingFilesFromDir = (dir) => {
            for (const file of Finder.create().sync().followLinks().files().in(dir).name(/\.(json|ya?ml)$/).sortByName()) {
                fileRecorder(file.extension, file.realpath);
            }
        };

        const registerMappingFilesFromConfig = () => {
            for (const path of Object.values(config.mapping.paths)) {
                if (isDir(path)) {
                    registerMappingFilesFromDir(path);
                    container.addResource(new DirectoryResource(path, '/^$/'));
                } else if (container.fileExists(path, false)) {
                    const matches = path.match(/\.(json|ya?ml)$/);
                    if (! matches) {
                        throw new RuntimeException(__jymfony.sprintf('Unsupported mapping type in "%s", supported types are JSON & Yaml.', path));
                    }

                    fileRecorder(matches[1], path);
                } else {
                    throw new RuntimeException(__jymfony.sprintf('Could not open file or directory "%s".', path));
                }
            }
        };

        for (const bundle of Object.values(container.getParameter('kernel.bundles_metadata'))) {
            let file;
            const configDir = isDir(bundle.path + '/config') ? bundle.path + '/config' : bundle.path + '/Resources/config';

            if (
                container.fileExists(file = configDir + '/validation.yaml', false) ||
                container.fileExists(file = configDir + '/validation.yml', false)
            ) {
                fileRecorder('yaml', file);
            }

            if (container.fileExists(file = configDir + '/validation.json', false)) {
                fileRecorder('json', file);
            }

            const dir = configDir + '/validation';
            if (container.fileExists(dir, '/^$/')) {
                registerMappingFilesFromDir(dir, fileRecorder);
            }
        }

        const projectDir = container.getParameter('kernel.project_dir');
        const dir = projectDir + '/config/validator';
        if (container.fileExists(dir, '/^$/')) {
            registerMappingFilesFromDir(dir, fileRecorder);
        }

        registerMappingFilesFromConfig(container, config, fileRecorder);
    }
}
