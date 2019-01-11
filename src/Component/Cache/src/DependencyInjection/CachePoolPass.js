const AbstractAdapter = Jymfony.Component.Cache.Adapter.AbstractAdapter;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Container = Jymfony.Component.DependencyInjection.Container;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;

const crypto = require('crypto');

/**
 * @memberOf Jymfony.Component.Cache.DependencyInjection
 */
class CachePoolPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        let seed;
        if (container.hasParameter('cache.prefix.seed')) {
            seed = '.' + container.parameterBag.resolveValue(container.getParameter('cache.prefix.seed'));
        } else {
            seed = '_' + container.getParameter('kernel.project_dir');
        }
        seed += '.' + container.getParameter('kernel.container_class');

        const pools = {};
        const clearers = {};
        const attributes = [
            'provider',
            'name',
            'namespace',
            'default_lifetime',
        ];
        for (const [ id, tags ] of __jymfony.getEntries(container.findTaggedServiceIds('cache.pool'))) {
            let adapter, pool;
            adapter = pool = container.getDefinition(id);
            if (pool.isAbstract()) {
                continue;
            }

            while (adapter instanceof ChildDefinition) {
                adapter = container.findDefinition(adapter.getParent());
                const t = adapter.getTag('cache.pool');
                if (0 < t.length) {
                    tags[0] = Object.assign({}, t[0], tags[0]);
                }
            }

            const name = tags[0].name || id;
            if (undefined === tags[0].namespace) {
                tags[0].namespace = __self._getNamespace(seed, name);
            }

            let clearer;
            if (undefined !== tags[0].clearer) {
                clearer = tags[0].clearer;
                while (container.hasAlias(clearer)) {
                    clearer = container.getAlias(clearer).toString();
                }
            } else {
                clearer = null;
            }

            delete tags[0].clearer;
            delete tags[0].name;

            if (tags[0].provider) {
                tags[0].provider = new Reference(__self.getServiceProvider(container, tags[0].provider));
            }

            let i = 0;
            for (const attr of attributes) {
                if (undefined === tags[0][attr]) {
                    // No-op
                } else if ('namespace' !== attr || 'Jymfony.Component.Cache.Adapter.ArrayAdapter' !== adapter.getClass()) {
                    pool.replaceArgument(i++, tags[0][attr]);
                }

                delete tags[0][attr];
            }

            if (0 !== Object.keys(tags[0]).length) {
                throw new InvalidArgumentException(__jymfony.sprintf('Invalid "cache.pool" tag for service "%s": accepted attributes are "clearer", "provider", "name", "namespace" and "default_lifetime", found "%s".', 'cache.pool', id, Object.keys(tags[0]).join('", "')));
            }

            if (undefined !== clearer) {
                if (undefined === clearers[clearer]) {
                    clearers[clearer] = {};
                }

                clearers[clearer][name] = new Reference(id, Container.IGNORE_ON_UNINITIALIZED_REFERENCE);
            }

            pools[name] = new Reference(id, Container.IGNORE_ON_UNINITIALIZED_REFERENCE);
        }
    }

    static _getNamespace(seed, id) {
        const hash = crypto.createHash('sha256');
        hash.update(id + seed);
        const digest = hash.digest().toString('base64');

        return digest.replace(/\//g, '-').substr(0, 10);
    }


    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string} name
     *
     * @internal
     */
    static getServiceProvider(container, name) {
        name = container.parameterBag.resolveValue(name, false);
        if (name.match(/^(%env\(.+\)%|[a-z]+:)/)) {
            const dsn = name;

            if (! container.hasDefinition(name = '.cache_connection.' + ContainerBuilder.hash(dsn))) {
                const definition = new Definition(AbstractAdapter);
                definition.setPublic(false);
                definition.setFactory('Jymfony.Component.Cache.Adapter.AbstractAdapter.createConnection');
                definition.setArguments([ dsn, [] ]);
                container.setDefinition(name, definition);
            }
        }

        return name;
    }
}

module.exports = CachePoolPass;
