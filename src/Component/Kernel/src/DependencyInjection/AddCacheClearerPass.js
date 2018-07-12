const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class AddCacheClearerPass extends implementationOf(CompilerPassInterface) {
    /**
     * Constructor.
     *
     * @param {string} [cacheClearerId = 'cache_clearer']
     * @param {string} [cacheClearerTag = 'kernel.cache_clearer']
     */
    __construct(cacheClearerId = 'cache_clearer', cacheClearerTag = 'kernel.cache_clearer') {
        /**
         * @type {string}
         *
         * @private
         */
        this._cacheClearerId = cacheClearerId;

        /**
         * @type {string}
         *
         * @private
         */
        this._cacheClearerTag = cacheClearerTag;
    }

    /**
     * @inheritdoc
     */
    process(container) {
        if (! container.hasDefinition(this._cacheClearerId)) {
            return;
        }

        const clearers = [];
        for (const [ id ] of __jymfony.getEntries(container.findTaggedServiceIds(this._cacheClearerTag))) {
            clearers.push(new Reference(id));
        }

        container.getDefinition(this._cacheClearerId).setArguments([ clearers ]);

        return clearers;
    }
}

module.exports = AddCacheClearerPass;
