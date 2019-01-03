/* eslint-disable indent */

const TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;
const ConfigurationInterface = Jymfony.Component.Config.Definition.ConfigurationInterface;
const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;
const UnsetKeyException = Jymfony.Component.Config.Definition.Exception.UnsetKeyException;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.DependencyInjection
 */
class Configuration extends implementationOf(ConfigurationInterface) {
    /**
     * @inheritdoc
     */
    get configTreeBuilder() {
        const treeBuilder = new TreeBuilder();
        const rootNode = treeBuilder.root('framework');

        rootNode
            .children()
                .booleanNode('test')
                    .defaultFalse()
                    .info('Enable test utilities')
                .end()
            .end()
        ;

        this._addConsoleSection(rootNode);
        this._addLoggerSection(rootNode);
        this._addRouterSection(rootNode);
        this._addHttpServerSection(rootNode);
        this._addCacheSection(rootNode);
        this._addSessionSection(rootNode);

        return treeBuilder;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addConsoleSection(rootNode) {
        rootNode
            .children()
                .arrayNode('console')
                .info('console configuration')
                [ReflectionClass.exists('Jymfony.Component.Console.Application') ? 'canBeDisabled' : 'canBeEnabled']()
            .end()
        ;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addLoggerSection(rootNode) {
        rootNode
            .children()
                .arrayNode('logger')
                .info('logger configuration')
                .canBeEnabled()
                .children()
                    .arrayNode('handlers')
                        .canBeUnset()
                        .useAttributeAsKey('name')
                        .arrayPrototype()
                            .canBeUnset()
                            .children()
                                .scalarNode('type')
                                    .isRequired()
                                    .treatNullLike('null')
                                    .beforeNormalization()
                                        .always()
                                        .then(v => v.toLowerCase())
                                    .end()
                                .end()
                                .scalarNode('id').end() // Service
                                .scalarNode('priority').defaultValue(0).end()
                                .scalarNode('level').defaultValue('DEBUG').end()
                                .scalarNode('bubble').defaultTrue().end()
                                .scalarNode('path').defaultValue('%kernel.logs_dir%/%kernel.environment%.log').end() // Stream
                                .scalarNode('file_permission') // Stream
                                    .defaultUndefined()
                                    .beforeNormalization()
                                        .ifString()
                                        .then(v => {
                                            if ('0' === v[0]) {
                                                return parseInt(v, 8);
                                            }

                                            return ~~v;
                                        })
                                    .end()
                                .end()
                                .scalarNode('webhook_url').defaultUndefined().end() // Slack
                                .scalarNode('channel').defaultUndefined().end() // Slack
                                .scalarNode('bot_name').defaultValue('Jymfony').end() // Slack
                                .scalarNode('use_attachment').defaultTrue().end() // Slack
                                .scalarNode('use_short_attachment').defaultFalse().end() // Slack
                                .scalarNode('include_extra').defaultFalse().end() // Slack
                                .scalarNode('icon_emoji').defaultUndefined().end() // Slack
                                .arrayNode('mongo')
                                    .canBeUnset()
                                    .beforeNormalization()
                                        .ifString()
                                        .then(v => {
                                            return { id: v };
                                        })
                                    .end()
                                    .children()
                                        .scalarNode('id').info('Connection service id').end()
                                        .scalarNode('url')
                                            .info('Connection url')
                                            .example('mongodb://localhost:27017/logs')
                                        .end()
                                        .scalarNode('collection').defaultValue('logs').end()
                                    .end()
                                    .validate()
                                        .ifTrue(v => undefined !== v.id && undefined !== v.url)
                                        .thenInvalid('Cannot set both id and url')
                                    .end()
                                .end()
                                .arrayNode('verbosity_levels') // Console
                                    .beforeNormalization()
                                        .ifArray()
                                        .then(v => {
                                            const map = {};
                                            for (const [ verbosity, level ] of __jymfony.getEntries(v)) {
                                                map[verbosity.toUpperCase()] = level.toUpperCase();
                                            }

                                            return map;
                                        })
                                    .end()
                                    .children()
                                        .scalarNode('VERBOSITY_QUIET').defaultValue('ERROR').end()
                                        .scalarNode('VERBOSITY_NORMAL').defaultValue('WARNING').end()
                                        .scalarNode('VERBOSITY_VERBOSE').defaultValue('NOTICE').end()
                                        .scalarNode('VERBOSITY_VERY_VERBOSE').defaultValue('INFO').end()
                                        .scalarNode('VERBOSITY_DEBUG').defaultValue('DEBUG').end()
                                    .end()
                                    .validate()
                                        .always(v => {
                                            const map = {};
                                            for (const [ verbosity, level ] of __jymfony.getEntries(v)) {
                                                if (! Jymfony.Component.Console.Output.OutputInterface.hasOwnProperty(verbosity)) {
                                                    throw new InvalidConfigurationException(
                                                        __jymfony.sprintf('The configured verbosity "%s" is invalid as it is not defined in OutputInterface', verbosity)
                                                    );
                                                }

                                                if (! isNumber(level)) {
                                                    const constant = Jymfony.Component.Logger.LogLevel[level];
                                                    if (undefined === constant) {
                                                        throw new InvalidConfigurationException(
                                                            __jymfony.sprintf('The configured minimum log level "%s" for verbosity "%s" is invalid as it is not defined in LogLevel', level, verbosity)
                                                        );
                                                    }
                                                }

                                                map[Jymfony.Component.Console.Output.OutputInterface[verbosity]] = ~~level;
                                            }

                                            return map;
                                        })
                                    .end()
                                .end()
                                .arrayNode('channels')
                                    .canBeUnset()
                                    .beforeNormalization()
                                        .ifString()
                                        .then(v => {
                                            return { elements: [ v ] };
                                        })
                                    .end()
                                    .beforeNormalization()
                                        .ifTrue(v => isArray(v))
                                        .then(v => {
                                            return { elements: v };
                                        })
                                    .end()
                                    .validate()
                                        .ifTrue(v => __jymfony.equal({}, v) || __jymfony.equal([], v))
                                        .thenUnset()
                                    .end()
                                    .validate()
                                        .always(v => {
                                            let exclusive = undefined;
                                            if (v.type) {
                                                exclusive = 'exclusive' === v.type;
                                            }

                                            const elements = [];
                                            for (const element of v.elements) {
                                                if ('!' === element.charAt(0)) {
                                                    if (false === exclusive) {
                                                        throw new InvalidConfigurationException('Cannot combine exclusive/inclusive definitions in channel list');
                                                    }

                                                    elements.push(element.substr(1));
                                                    exclusive = true;
                                                } else {
                                                    if (true === exclusive) {
                                                        throw new InvalidConfigurationException('Cannot combine exclusive/inclusive definitions in channel list');
                                                    }

                                                    elements.push(element);
                                                    exclusive = false;
                                                }
                                            }

                                            if (0 === elements.length) {
                                                throw new UnsetKeyException();
                                            }

                                            return { type: exclusive ? 'exclusive' : 'inclusive', elements };
                                        })
                                    .end()
                                    .children()
                                        .enumNode('type')
                                            .values([ 'inclusive', 'exclusive' ])
                                        .end()
                                        .arrayNode('elements')
                                            .scalarPrototype().end()
                                        .end()
                                    .end()
                                .end()
                                .scalarNode('formatter').end()
                                .booleanNode('nested').defaultFalse().end()
                            .end()
                            .validate()
                                .ifTrue(v => {
                                    return 'service' === v.type && !! v.formatter;
                                })
                                .thenInvalid('Service handlers can not have a formatter configured in the bundle, you must reconfigure the service itself instead')
                            .end()
                        .end()
                        .example({
                            main: {
                                type: 'stream',
                                path: '/var/log/jymfony.log',
                                level: 'ERROR',
                                formatter: 'my_formatter',
                            },
                            custom: {
                                type: 'service',
                                id: 'my_handler',
                            },
                        })
                    .end()
                .end()
        ;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addRouterSection(rootNode) {
        rootNode
            .children()
                .arrayNode('router')
                .info('router configuration')
                .canBeEnabled()
                .children()
                    .scalarNode('resource').isRequired().end()
                    .scalarNode('type').end()
                .end()
            .end()
        ;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addHttpServerSection(rootNode) {
        rootNode
            .children()
                .arrayNode('http_server')
                .info('http server configuration')
                .addDefaultsIfNotSet()
                .canBeEnabled()
                .children()
                    .scalarNode('key').info('Encryption key for secure server').end()
                    .scalarNode('certificate').info('Certificate for secure server').end()
                .end()
                .validate()
                    .ifTrue(v => (! v.key && v.certificate) || (v.key && ! v.certificate))
                    .thenInvalid('"key" and "certificate" option must be both set or null')
                .end()
            .end()
        ;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addCacheSection(rootNode) {
        rootNode
            .children()
                .arrayNode('cache')
                    .info('Cache configuration')
                    .addDefaultsIfNotSet()
                    .children()
                        .scalarNode('prefix_seed')
                            .info('Used to namespace cache keys when using several apps with the same shared backend')
                            .example('my-application-name')
                        .end()
                        .scalarNode('app')
                            .info('App related cache pools configuration')
                            .defaultValue('cache.adapter.filesystem')
                        .end()
                        .scalarNode('system')
                            .info('System related cache pools configuration')
                            .defaultValue('cache.adapter.system')
                        .end()
                        .scalarNode('directory').defaultValue('%kernel.cache_dir%/pools').end()
                        .scalarNode('default_redis_provider').defaultValue('redis://localhost').end()
                        // .scalarNode('default_memcached_provider').defaultValue('memcached://localhost').end()
                        .arrayNode('pools')
                            .useAttributeAsKey('name')
                            .prototype('array')
                                .children()
                                    .scalarNode('adapter').defaultValue('cache.app').end()
                                    .booleanNode('public').defaultFalse().end()
                                    .integerNode('default_lifetime').end()
                                    .scalarNode('provider')
                                        .info('The service name to use as provider when the specified adapter needs one.')
                                    .end()
                                    .scalarNode('clearer').end()
                                .end()
                            .end()
                            .validate()
                                .ifTrue(v => v['cache.app'] || v['cache.system'])
                                .thenInvalid('"cache.app" and "cache.system" are reserved names')
                            .end()
                        .end()
                    .end()
                .end()
            .end()
        ;
    }

    _addSessionSection(rootNode) {
        rootNode
            .children()
                .arrayNode('session')
                    .info('session configuration')
                    .canBeEnabled()
                    .children()
                        .scalarNode('storage_id').defaultValue('session.storage.filesystem').end()
                        .scalarNode('name')
                            .validate()
                                .ifTrue(v => Object.keys(__jymfony.parse_query_string(v.toString())).join('&') !== v.toString())
                                .thenInvalid('Session name %s contains illegal character(s)')
                            .end()
                        .end()
                        .scalarNode('cookie_lifetime').end()
                        .scalarNode('cookie_path').end()
                        .scalarNode('cookie_domain').end()
                        .booleanNode('cookie_secure').end()
                        .booleanNode('cookie_httponly').defaultTrue().end()
                        .booleanNode('use_cookies').end()
                        .scalarNode('max_lifetime').end()
                        .scalarNode('save_path').defaultValue('%kernel.cache_dir%/sessions').end()
                    .end()
                .end()
            .end()
        ;
    }
}

module.exports = Configuration;
