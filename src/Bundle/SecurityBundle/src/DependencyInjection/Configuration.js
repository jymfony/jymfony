/* eslint-disable indent */

const AbstractFactory = Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory.AbstractFactory;
const TreeBuilder = Jymfony.Component.Config.Definition.Builder.TreeBuilder;
const ConfigurationInterface = Jymfony.Component.Config.Definition.ConfigurationInterface;
const AccessDecisionManager = Jymfony.Component.Security.Authorization.AccessDecisionManager;

/**
 * @memberOf Jymfony.Bundle.SecurityBundle.DependencyInjection
 */
class Configuration extends implementationOf(ConfigurationInterface) {
    /**
     * @param {Jymfony.Bundle.SecurityBundle.DependencyInjection.UserProvider.UserProviderFactoryInterface[]} factories
     */
    set userProviderFactories(factories) {
        /**
         * @type {Jymfony.Bundle.SecurityBundle.DependencyInjection.UserProvider.UserProviderFactoryInterface[]}
         *
         * @private
         */
        this._userProviderFactories = factories;
    }

    /**
     * @param {Object.<string, Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory.SecurityFactoryInterface>} factories
     */
    set factories(factories) {
        /**
         * @type {Object.<string, Jymfony.Bundle.SecurityBundle.DependencyInjection.Security.Factory.SecurityFactoryInterface>}
         *
         * @private
         */
        this._factories = factories;
    }

    /**
     * @inheritdoc
     */
    get configTreeBuilder() {
        const treeBuilder = new TreeBuilder();
        const rootNode = treeBuilder.root('security');

        rootNode
            .canBeEnabled()
            .beforeNormalization()
                .ifTrue(v => {
                    return !v.access_decision_manager || (!v.access_decision_manager.service && !v.access_decision_manager.strategy);
                })
                .then(v => {
                    v.access_decision_manager = {
                        strategy: AccessDecisionManager.STRATEGY_AFFIRMATIVE,
                    };

                    return v;
                })
            .end()
            .children()
                .scalarNode('access_denied_path').defaultUndefined().example('/foo/error403').end()
                .booleanNode('hide_user_not_found').defaultTrue().end()
                .booleanNode('erase_credentials').defaultTrue().end()
                .arrayNode('access_decision_manager')
                    .addDefaultsIfNotSet()
                    .children()
                        .enumNode('strategy')
                            .values([ AccessDecisionManager.STRATEGY_AFFIRMATIVE, AccessDecisionManager.STRATEGY_CONSENSUS, AccessDecisionManager.STRATEGY_UNANIMOUS ])
                        .end()
                        .scalarNode('service').end()
                        .booleanNode('allow_if_all_abstain').defaultFalse().end()
                        .booleanNode('allow_if_equal_granted_denied').defaultTrue().end()
                    .end()
                    .validate()
                        .ifTrue(v => v.strategy && v.service)
                        .thenInvalid('"strategy" and "service" cannot be used together.')
                    .end()
                .end()
        ;

        this._addEncodersSection(rootNode);
        this._addProvidersSection(rootNode);
        this._addFirewallsSection(rootNode);
        this._addAccessControlSection(rootNode);
        this._addRoleHierarchySection(rootNode);
        this._addAccessControlSection(rootNode);

        return treeBuilder;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addRoleHierarchySection(rootNode) {
        rootNode
            .children()
                .arrayNode('role_hierarchy')
                    .useAttributeAsKey('id')
                    .prototype('array')
                        .performNoDeepMerging()
                        .beforeNormalization().ifString().then(v => {
                            return {value: v};
                        }).end()
                        .beforeNormalization()
                            .ifTrue(v => !! (v && v.value))
                            .then(v => v.split(/\s*,\s*/))
                        .end()
                        .scalarPrototype().end()
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
    _addAccessControlSection(rootNode) {
        rootNode
            .children()
                .arrayNode('access_control')
                    .cannotBeOverwritten()
                    .prototype('array')
                        .children()
                            .scalarNode('requires_channel').defaultUndefined().end()
                            .scalarNode('path')
                                .defaultUndefined()
                                .info('use the urldecoded format')
                                .example('^/path to resource/')
                            .end()
                            .scalarNode('host').defaultUndefined().end()
                            .arrayNode('ips')
                                .beforeNormalization().ifString().then(v => [ v ]).end()
                                .prototype('scalar').end()
                            .end()
                            .arrayNode('methods')
                                .beforeNormalization().ifString().then(v => v.split(/\s*,\s*/)).end()
                                .prototype('scalar').end()
                            .end()
                            .scalarNode('allow_if').defaultUndefined().end()
                        .end()
                        .children()
                            .arrayNode('roles')
                                .beforeNormalization().ifString().then(v => v.split(/\s*,\s*/)).end()
                                .prototype('scalar').end()
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
    _addFirewallsSection(rootNode) {
        const firewallNodeBuilder = rootNode
            .children()
                .arrayNode('firewalls')
                    .isRequired()
                    .requiresAtLeastOneElement()
                    .disallowNewKeysInSubsequentConfigs()
                    .useAttributeAsKey('name')
                    .prototype('array')
                        .canBeDisabled()
                        .children()
        ;

        firewallNodeBuilder
            .scalarNode('pattern').end()
            .scalarNode('host').end()
            .arrayNode('methods')
                .beforeNormalization().ifString().then(v => v.split(/\s*,\s*/)).end()
                .defaultValue([])
                .prototype('scalar').end()
            .end()
            .scalarNode('user_checker')
                .defaultValue('security.user_checker')
                .treatNullLike('security.user_checker')
                .info('The UserChecker to use when authenticating users in this firewall.')
            .end()
            .scalarNode('request_matcher').end()
            .scalarNode('access_denied_path').end()
            .scalarNode('access_denied_handler').end()
            .scalarNode('entry_point').end()
            .scalarNode('provider').end()
            .booleanNode('stateless').defaultFalse().end()
            .scalarNode('context').cannotBeEmpty().end()
            .arrayNode('logout')
                .treatTrueLike({})
                .canBeUnset()
                .children()
                    .scalarNode('csrf_parameter').defaultValue('_csrf_token').end()
                    .scalarNode('csrf_token_generator').cannotBeEmpty().end()
                    .scalarNode('csrf_token_id').defaultValue('logout').end()
                    .scalarNode('path').defaultValue('/logout').end()
                    .scalarNode('target').defaultValue('/').end()
                    .booleanNode('invalidate_session').defaultTrue().end()
                .end()
                .children()
                    .arrayNode('delete_cookies')
                        .beforeNormalization()
                            .ifTrue(v => Array.isArray(v))
                            .then(v => v.map({ name: v }))
                        .end()
                        .useAttributeAsKey('name')
                        .prototype('array')
                            .children()
                                .scalarNode('path').defaultUndefined().end()
                                .scalarNode('domain').defaultUndefined().end()
                            .end()
                        .end()
                    .end()
                .end()
                .children()
                    .arrayNode('handlers')
                        .prototype('scalar').end()
                    .end()
                .end()
            .end()
            .arrayNode('anonymous')
                .canBeUnset()
                .children()
                    .scalarNode('secret').defaultUndefined().end()
                .end()
            .end()
            .arrayNode('switch_user')
                .canBeUnset()
                .children()
                    .scalarNode('provider').end()
                    .scalarNode('parameter').defaultValue('_switch_user').end()
                    .scalarNode('role').defaultValue('ROLE_ALLOWED_TO_SWITCH').end()
                .end()
            .end()
        ;

        const abstractFactoryKeys = [];
        for (const factoriesAtPosition of Object.values(this._factories)) {
            for (const factory of factoriesAtPosition) {
                const name = factory.getKey().replace(/-/g, '_');
                const factoryNode = firewallNodeBuilder
                    .arrayNode(name)
                    .canBeUnset()
                ;

                if (factory instanceof AbstractFactory) {
                    abstractFactoryKeys.push(name);
                }

                factory.addConfiguration(factoryNode);
            }
        }

        // Check for unreachable check paths
        firewallNodeBuilder
            .end()
            .validate()
                .ifTrue(v => true === v.security && v.pattern && ! v.request_matcher)
                .then((firewall) => {
                    for (const k of abstractFactoryKeys) {
                        if (! firewall[k].check_path) {
                            continue;
                        }

                        if (-1 !== firewall[k].check_path.indexOf('/') && firewall[k].check_path.match(new RegExp(firewall.pattern))) {
                            throw new LogicException(__jymfony.sprintf('The check_path "%s" for login method "%s" is not matched by the firewall pattern "%s".', firewall[k].check_path, k, firewall.pattern));
                        }
                    }

                    return firewall;
                })
            .end()
        ;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addProvidersSection(rootNode) {
        const providerNodeBuilder = rootNode
            .children()
                .arrayNode('providers')
                    .example({
                        'my_memory_provider': {
                            'memory': {
                                'users': {
                                    'foo': {'password': 'foo', 'roles': 'ROLE_USER'},
                                    'bar': {'password': 'bar', 'roles': '[ROLE_USER, ROLE_ADMIN]'},
                                },
                            },
                        },
                        'my_entity_provider': {'entity': {'class': 'SecurityBundle.User', 'property': 'username'}},
                    })
                    .requiresAtLeastOneElement()
                    .useAttributeAsKey('name')
                    .arrayPrototype()
        ;

        providerNodeBuilder
            .children()
                .scalarNode('id').end()
                .arrayNode('chain')
                    .children()
                        .arrayNode('providers')
                            .beforeNormalization()
                                .ifString()
                                .then(v => v.split(/\s*,\s*/g))
                            .end()
                            .scalarPrototype().end()
                        .end()
                    .end()
                .end()
            .end()
        ;

        for (const factory of this._userProviderFactories) {
            const name = factory.getKey().replace(/-/g, '_');
            const factoryNode = providerNodeBuilder.children().arrayNode(name).canBeUnset();

            factory.addConfiguration(factoryNode);
        }

        providerNodeBuilder
            .validate()
                .ifTrue(v => 1 < Object.keys(v).length)
                .thenInvalid('You cannot set multiple provider types for the same provider')
            .end()
            .validate()
                .ifTrue(v => 0 === Object.keys(v).length)
                .thenInvalid('You must set a provider definition for the provider.')
            .end()
        ;
    }

    /**
     * @param {Jymfony.Component.Config.Definition.Builder.ArrayNodeDefinition} rootNode
     *
     * @private
     */
    _addEncodersSection(rootNode) {
        rootNode
            .children()
                .arrayNode('encoders')
                    .example({
                        'AppBundle.Entity.User1': 'bcrypt',
                        'AppBundle.Entity.User2': {
                            algorithm: 'bcrypt',
                            cost: 13,
                        },
                    })
                    .requiresAtLeastOneElement()
                    .useAttributeAsKey('class')
                    .prototype('array')
                        .canBeUnset()
                        .performNoDeepMerging()
                        .beforeNormalization().ifString().then(v => {
                            return { algorithm: v };
                        }).end()
                        .children()
                            .scalarNode('algorithm').cannotBeEmpty().end()
                            .scalarNode('hash_algorithm').info('Name of hashing algorithm for PBKDF2 (i.e. sha256, sha512, etc..) See hash_algos() for a list of supported algorithms.').defaultValue('sha512').end()
                            .scalarNode('key_length').defaultValue(40).end()
                            .booleanNode('ignore_case').defaultFalse().end()
                            .booleanNode('encode_as_base64').defaultTrue().end()
                            .scalarNode('iterations').defaultValue(5000).end()
                            .integerNode('cost')
                                .min(4)
                                .max(31)
                                .defaultValue(13)
                            .end()
                            .scalarNode('id').end()
                        .end()
                    .end()
                .end()
            .end()
        ;
    }
}

module.exports = Configuration;
