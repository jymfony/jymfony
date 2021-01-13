/* eslint-disable indent */

const ConfigurationInterface = Jymfony.Component.Config.Definition.ConfigurationInterface;
const InvalidConfigurationException = Jymfony.Component.Config.Definition.Exception.InvalidConfigurationException;
const NodeBuilder = Jymfony.Component.Config.Definition.Builder.NodeBuilder;
const TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;
const UnsetKeyException = Jymfony.Component.Config.Definition.Exception.UnsetKeyException;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.DependencyInjection
 */
export default class Configuration extends implementationOf(ConfigurationInterface) {
    /**
     * @inheritdoc
     */
    get configTreeBuilder() {
        const treeBuilder = new TreeBuilder('framework');
        /** @type {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} */
        const rootNode = treeBuilder.rootNode;

        rootNode
            .children()
                .booleanNode('test')
                    .defaultFalse()
                    .info('Enable test utilities')
                .end()
            .end()
        ;

        this._addCacheSection(rootNode);
        this._addConsoleSection(rootNode);
        this._addDebugSection(rootNode);
        this._addHttpClientSection(rootNode);
        this._addHttpServerSection(rootNode);
        this._addLoggerSection(rootNode);
        this._addRouterSection(rootNode);
        this._addSessionSection(rootNode);
        this._addTemplatingSection(rootNode);
        this._addValidationSection(rootNode);

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
    _addDebugSection(rootNode) {
        rootNode
            .children()
                .arrayNode('debug')
                .info('debug configuration')
                .canBeEnabled()
                .children()
                    .booleanNode('enabled')
                        .defaultValue('%kernel.debug%')
                    .end()
                    .arrayNode('dump')
                    .addDefaultsIfNotSet()
                    .children()
                        .integerNode('max_items')
                            .defaultValue(2500)
                        .end()
                        .integerNode('min_depth')
                            .defaultValue(1)
                        .end()
                        .integerNode('max_string_length').end()
                        .scalarNode('file_link_format')
                            .defaultValue('%debug.file_link_format%')
                        .end()
                    .end()
                .end()
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
                                                map[String(verbosity).toUpperCase()] = level.toUpperCase();
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
                                                    const constant = Jymfony.Contracts.Logger.LogLevel[level];
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
    _addHttpClientSection(rootNode) {
        rootNode
            .children()
                .arrayNode('http_client')
                    .info('HTTP Client configuration')
                    [ReflectionClass.exists('Jymfony.Component.HttpClient.HttpClient') ? 'canBeDisabled' : 'canBeEnabled']()
                    .beforeNormalization()
                        .always(config => {
                            if (! config.scoped_clients || ! isObjectLiteral(config.default_options && config.default_options.retry_failed)) {
                                return config;
                            }

                            for (const scopedConfig of Object.values(config.scoped_clients)) {
                                if (! scopedConfig.retry_failed || true === scopedConfig.retry_failed) {
                                    scopedConfig.retry_failed = __jymfony.clone(config.default_options.retry_failed);
                                    continue;
                                }

                                if (isObjectLiteral(scopedConfig.retry_failed)) {
                                    Object.assign(scopedConfig.retry_failed, config.default_options.retry_failed);
                                }
                            }

                            return config;
                        })
                    .end()
                    .children()
                        .integerNode('max_host_connections')
                            .info('The maximum number of connections to a single host.')
                        .end()
                        .arrayNode('default_options')
                            .children()
                                .arrayNode('headers')
                                    .info('Associative array: header => value(s).')
                                    .useAttributeAsKey('name')
                                    .normalizeKeys(false)
                                    .variablePrototype().end()
                                .end()
                                .integerNode('max_redirects')
                                    .info('The maximum number of redirects to follow.')
                                .end()
                                .scalarNode('http_version')
                                    .info('The default HTTP version, typically 1.1 or 2.0, leave to null for the best version.')
                                .end()
                                .arrayNode('resolve')
                                    .info('Associative array: domain => IP.')
                                    .useAttributeAsKey('host')
                                    .beforeNormalization()
                                        .always(config => {
                                            if (! isObjectLiteral(config)) {
                                                return {};
                                            }

                                            if ((! config.host && ! config.value) || 2 < Object.values(config).length) {
                                                return config;
                                            }

                                            return { [config.host]: config.value };
                                        })
                                    .end()
                                    .normalizeKeys(false)
                                    .scalarPrototype().end()
                                .end()
                                .scalarNode('proxy')
                                    .info('The URL of the proxy to pass requests through or null for automatic detection.')
                                .end()
                                .scalarNode('no_proxy')
                                    .info('A comma separated list of hosts that do not require a proxy to be reached.')
                                .end()
                                .floatNode('timeout')
                                    .info('The idle timeout, defaults to the "default_socket_timeout" ini parameter.')
                                .end()
                                .floatNode('max_duration')
                                    .info('The maximum execution time for the request+response as a whole.')
                                .end()
                                .scalarNode('bindto')
                                    .info('A network interface name, IP address, a host name or a UNIX socket to bind to.')
                                .end()
                                .booleanNode('verify_peer')
                                    .info('Indicates if the peer should be verified in a SSL/TLS context.')
                                .end()
                                .booleanNode('verify_host')
                                    .info('Indicates if the host should exist as a certificate common name.')
                                .end()
                                .scalarNode('cafile')
                                    .info('A certificate authority file.')
                                .end()
                                .scalarNode('capath')
                                    .info('A directory that contains multiple certificate authority files.')
                                .end()
                                .scalarNode('local_cert')
                                    .info('A PEM formatted certificate file.')
                                .end()
                                .scalarNode('local_pk')
                                    .info('A private key file.')
                                .end()
                                .scalarNode('passphrase')
                                    .info('The passphrase used to encrypt the "local_pk" file.')
                                .end()
                                .scalarNode('ciphers')
                                    .info('A list of SSL/TLS ciphers separated by colons, commas or spaces (e.g. "RC3-SHA:TLS13-AES-128-GCM-SHA256"...)')
                                .end()
                                .append(this._addHttpClientRetrySection())
                            .end()
                        .end()
                        .scalarNode('mock_response_factory')
                            .info('The id of the service that should generate mock responses. It should be either an invokable or an iterable.')
                        .end()
                        .arrayNode('scoped_clients')
                            .useAttributeAsKey('name')
                            .normalizeKeys(false)
                            .arrayPrototype()
                                .beforeNormalization()
                                    .always()
                                    .then(config => {
                                        if (! ReflectionClass.exists('Jymfony.Component.HttpClient.HttpClient')) {
                                            throw new LogicException('HttpClient support cannot be enabled as the component is not installed. Try running "yarn add @jymfony/http-client".');
                                        }

                                        return isObjectLiteral(config) ? config : { base_uri: config };
                                    })
                                .end()
                                .validate()
                                    .ifTrue(v => ! v.scope && ! v.base_uri)
                                    .thenInvalid('Either "scope" or "base_uri" should be defined.')
                                .end()
                                .validate()
                                    .ifTrue(v => !! v.query && ! v.base_uri)
                                    .thenInvalid('"query" applies to "base_uri" but no base URI is defined.')
                                .end()
                                .children()
                                    .scalarNode('scope')
                                        .info('The regular expression that the request URL must match before adding the other options. When none is provided, the base URI is used instead.')
                                        .cannotBeEmpty()
                                    .end()
                                    .scalarNode('base_uri')
                                        .info('The URI to resolve relative URLs, following rules in RFC 3985, section 2.')
                                        .cannotBeEmpty()
                                    .end()
                                    .scalarNode('auth_basic')
                                        .info('An HTTP Basic authentication "username:password".')
                                    .end()
                                    .scalarNode('auth_bearer')
                                        .info('A token enabling HTTP Bearer authorization.')
                                    .end()
                                    .scalarNode('auth_ntlm')
                                        .info('A "username:password" pair to use Microsoft NTLM authentication (requires the cURL extension).')
                                    .end()
                                    .arrayNode('query')
                                        .info('Associative array of query string values merged with the base URI.')
                                        .useAttributeAsKey('key')
                                        .beforeNormalization()
                                            .always(config => {
                                                if (! isObjectLiteral(config)) {
                                                    return {};
                                                }

                                                if ((! config.key && ! config.value) || 2 < Object.keys(config).length) {
                                                    return config;
                                                }

                                                return { [config.key]: config.value };
                                            })
                                        .end()
                                        .normalizeKeys(false)
                                        .scalarPrototype().end()
                                    .end()
                                    .arrayNode('headers')
                                        .info('Associative array: header => value(s).')
                                        .useAttributeAsKey('name')
                                        .normalizeKeys(false)
                                        .variablePrototype().end()
                                    .end()
                                    .integerNode('max_redirects')
                                        .info('The maximum number of redirects to follow.')
                                    .end()
                                    .scalarNode('http_version')
                                        .info('The default HTTP version, typically 1.1 or 2.0, leave to null for the best version.')
                                    .end()
                                    .arrayNode('resolve')
                                        .info('Associative array: domain => IP.')
                                        .useAttributeAsKey('host')
                                        .beforeNormalization()
                                            .always(config => {
                                                if (! isObjectLiteral(config)) {
                                                    return {};
                                                }

                                                if ((! config.host && ! config.value) || 2 < Object.keys(config).length) {
                                                    return config;
                                                }

                                                return { [config.host]: config.value };
                                            })
                                        .end()
                                        .normalizeKeys(false)
                                        .scalarPrototype().end()
                                    .end()
                                    .scalarNode('proxy')
                                        .info('The URL of the proxy to pass requests through or null for automatic detection.')
                                    .end()
                                    .scalarNode('no_proxy')
                                        .info('A comma separated list of hosts that do not require a proxy to be reached.')
                                    .end()
                                    .floatNode('timeout')
                                        .info('The idle timeout, defaults to the "default_socket_timeout" ini parameter.')
                                    .end()
                                    .floatNode('max_duration')
                                        .info('The maximum execution time for the request+response as a whole.')
                                    .end()
                                    .scalarNode('bindto')
                                        .info('A network interface name, IP address, a host name or a UNIX socket to bind to.')
                                    .end()
                                    .booleanNode('verify_peer')
                                        .info('Indicates if the peer should be verified in a SSL/TLS context.')
                                    .end()
                                    .booleanNode('verify_host')
                                        .info('Indicates if the host should exist as a certificate common name.')
                                    .end()
                                    .scalarNode('cafile')
                                        .info('A certificate authority file.')
                                    .end()
                                    .scalarNode('capath')
                                        .info('A directory that contains multiple certificate authority files.')
                                    .end()
                                    .scalarNode('local_cert')
                                        .info('A PEM formatted certificate file.')
                                    .end()
                                    .scalarNode('local_pk')
                                        .info('A private key file.')
                                    .end()
                                    .scalarNode('passphrase')
                                        .info('The passphrase used to encrypt the "local_pk" file.')
                                    .end()
                                    .scalarNode('ciphers')
                                        .info('A list of SSL/TLS ciphers separated by colons, commas or spaces (e.g. "RC3-SHA:TLS13-AES-128-GCM-SHA256"...)')
                                    .end()
                                    .append(this._addHttpClientRetrySection())
                                .end()
                            .end()
                        .end()
                    .end()
                .end()
            .end()
        ;
    }

    _addHttpClientRetrySection() {
        const root = new NodeBuilder();

        return root
            .arrayNode('retry_failed')
                .canBeEnabled()
                .addDefaultsIfNotSet()
                .beforeNormalization()
                    .always(v => {
                        if (!! v.retry_strategy && (!! v.http_codes || !! v.delay || !! v.multiplier || !! v.max_delay)) {
                            throw new InvalidArgumentException('The "retry_strategy" option cannot be used along with the "http_codes", "delay", "multiplier" or "max_delay" options.');
                        }

                        return v;
                    })
                .end()
                .children()
                    .scalarNode('retry_strategy').defaultNull().info('service id to override the retry strategy').end()
                    .arrayNode('http_codes')
                        .performNoDeepMerging()
                        .beforeNormalization()
                            .ifArray()
                            .then(v => {
                                const list = [];
                                for (const [ key, val ] of __jymfony.getEntries(v)) {
                                    if (isNumeric(val)) {
                                        list.push({ code: val });
                                    } else if (isObjectLiteral(val)) {
                                        if (!! val.code || !! val.methods) {
                                            list.push(val);
                                        } else {
                                            list.push({ code: key, methods: val });
                                        }
                                    } else if (true === val || null === val) {
                                        list.push({ code: key });
                                    }
                                }

                                return list;
                            })
                        .end()
                        .useAttributeAsKey('code')
                        .arrayPrototype()
                            .children()
                                .integerNode('code').end()
                                .arrayNode('methods')
                                    .beforeNormalization()
                                    .ifArray()
                                        .then(v => String(v).toUpperCase())
                                    .end()
                                    .prototype('scalar').end()
                                    .info('A list of HTTP methods that triggers a retry for this status code. When empty, all methods are retried')
                                .end()
                            .end()
                        .end()
                        .info('A list of HTTP status code that triggers a retry')
                    .end()
                    .integerNode('max_retries').defaultValue(3).min(0).end()
                    .integerNode('delay').defaultValue(1000).min(0).info('Time in ms to delay (or the initial value when multiplier is used)').end()
                    .floatNode('multiplier').defaultValue(2).min(1).info('If greater than 1, delay will grow exponentially for each retry: delay * (multiple ^ retries)').end()
                    .integerNode('max_delay').defaultValue(0).min(0).info('Max time in ms that a retry should ever be delayed (0 = infinite)').end()
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
                    .scalarNode('request_timeout')
                        .defaultValue(-1)
                        .info('Request timeout in milliseconds')
                    .end()
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
                            .arrayPrototype()
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

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addSessionSection(rootNode) {
        rootNode
            .children()
                .arrayNode('session')
                    .info('session configuration')
                    .canBeEnabled()
                    .children()
                        .scalarNode('storage_id').defaultValue('session.storage.filesystem').end()
                        .scalarNode('name')
                            .defaultValue('JFSESSID')
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
                        .scalarNode('max_lifetime').end()
                        .scalarNode('save_path').defaultValue('%kernel.cache_dir%/sessions').end()
                    .end()
                .end()
            .end()
        ;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addTemplatingSection(rootNode) {
        rootNode
            .children()
                .arrayNode('templating')
                    .addDefaultsIfNotSet()
                    .info('templating configuration')
                    [ReflectionClass.exists('Jymfony.Component.Templating.Engine.EngineInterface') ? 'canBeDisabled' : 'canBeEnabled']()
                    .beforeNormalization()
                        .ifTrue((v) => false === v || false === v.enabled)
                        .then(() => {
                            return { enabled: false, engines: false };
                        })
                    .end()
                    .children()
                        .scalarNode('cache').end()
                        .arrayNode('engines')
                            .defaultValue([])
                            .example([ 'kumis' ])
                            .isRequired()
                            .requiresAtLeastOneElement()
                            .canBeUnset()
                            .beforeNormalization()
                                .ifTrue((v) => ! isArray(v) && false !== v)
                                .then((v) => [ v ])
                            .end()
                            .prototype('scalar').end()
                        .end()
                        .arrayNode('loaders')
                            .beforeNormalization()
                                .ifTrue((v) => ! isArray(v))
                                .then((v) => [ v ])
                            .end()
                            .prototype('scalar').end()
                        .end()
                    .end()
                .end()
            .end()
        ;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addValidationSection(rootNode) {
        rootNode
            .children()
                .arrayNode('validation')
                    .info('validation configuration')
                    [ReflectionClass.exists('Jymfony.Component.Validator.Validation') ? 'canBeDisabled' : 'canBeEnabled']()
                    .children()
                        .scalarNode('cache').end()
                        .booleanNode('enable_decorators').defaultTrue().end()
                        .arrayNode('static_method')
                            .defaultValue([ 'loadValidatorMetadata' ])
                            .prototype('scalar').end()
                            .treatFalseLike([])
                            .validate().castToArray().end()
                        .end()
                        .scalarNode('translation_domain').defaultValue('validators').end()
                        .enumNode('email_validation_mode').values([ 'html5', 'loose', 'strict' ]).defaultUndefined().end()
                        .arrayNode('mapping')
                            .addDefaultsIfNotSet()
                                .children()
                                    .arrayNode('paths')
                                    .prototype('scalar').end()
                                .end()
                            .end()
                        .end()
                        // .arrayNode('not_compromised_password')
                        //     .canBeDisabled()
                        //     .children()
                        //         .booleanNode('enabled')
                        //             .defaultTrue()
                        //             .info('When disabled, compromised passwords will be accepted as valid.')
                        //         .end()
                        //         .scalarNode('endpoint')
                        //             .defaultNull()
                        //             .info('API endpoint for the NotCompromisedPassword Validator.')
                        //         .end()
                        //     .end()
                        // .end()
                    .end()
                .end()
            .end()
        ;
    }

}
