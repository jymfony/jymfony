const Compiler = Jymfony.Component.DependencyInjection.Compiler;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class PassConfig {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Jymfony.Component.DependencyInjection.Compiler.MergeExtensionConfigurationPass}
         *
         * @private
         */
        this._mergePass = new Compiler.MergeExtensionConfigurationPass();

        /**
         * @type {Object}
         *
         * @private
         */
        this._beforeOptimizationPasses = {
            100: [
                new Compiler.ResolveClassPass(),
            ],
            [(-1000)]: [
                new Compiler.ExtensionCompilerPass(),
            ],
        };

        /**
         * @type {Object}
         *
         * @private
         */
        this._optimizationPasses = {
            0: [
                new Compiler.ResolveChildDefinitionsPass(),
                new Compiler.DecoratorServicePass(),
                new Compiler.ResolveParameterPlaceHoldersPass(),
                new Compiler.CheckDefinitionValidityPass(),
                new Compiler.ResolveTaggedIteratorArgumentPass(),
                new Compiler.ResolveReferencesToAliasesPass(),
                new Compiler.ResolveInvalidReferencesPass(),
                new Compiler.AnalyzeServiceReferencesPass(true),
                new Compiler.CheckCircularReferencesPass(),
                new Compiler.CheckReferenceValidityPass(),
            ],
        };

        /**
         * @type {Object}
         *
         * @private
         */
        this._beforeRemovingPasses = {};

        /**
         * @type {Object}
         *
         * @private
         */
        this._removingPasses = {
            0: [
                new Compiler.RemovePrivateAliasesPass(),
                new Compiler.ReplaceAliasByActualDefinitionPass(),
                new Compiler.RemoveAbstractDefinitionsPass(),
                new Compiler.RepeatedPass([
                    new Compiler.AnalyzeServiceReferencesPass(),
                    new Compiler.InlineServiceDefinitionsPass(),
                    new Compiler.AnalyzeServiceReferencesPass(),
                    new Compiler.RemoveUnusedDefinitionsPass(),
                ]),
                new Compiler.CheckExceptionOnInvalidReferenceBehaviorPass(),
            ],
        };

        /**
         * @type {Object}
         *
         * @private
         */
        this._afterRemovingPasses = {};
    }

    /**
     * Add a compilation pass
     *
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface} pass
     * @param {string} type
     * @param {int} priority
     */
    addPass(pass, type, priority) {
        const property = '_' + type + 'Passes';
        if (! this.hasOwnProperty(property)) {
            throw new InvalidArgumentException('Invalid type ' + type);
        }

        const collection = this[property];
        if (! collection[priority]) {
            collection[priority] = [];
        }

        collection[priority].push(pass);
    }

    /**
     * @returns {Generator|Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface[]}
     */
    * getPasses() {
        yield this._mergePass;

        yield * [
            ...this._getBeforeOptimizationPasses(),
            ...this._getOptimizationPasses(),
            ...this._getBeforeRemovingPasses(),
            ...this._getRemovingPasses(),
            ...this._getAfterRemovingPasses(),
        ];
    }

    /**
     * @returns {IterableIterator<Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface>}
     *
     * @private
     */
    _getBeforeOptimizationPasses() {
        return this._sortPasses(this._beforeOptimizationPasses);
    }

    /**
     * @returns {IterableIterator<Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface>}
     *
     * @private
     */
    _getOptimizationPasses() {
        return this._sortPasses(this._optimizationPasses);
    }

    /**
     * @returns {IterableIterator<Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface>}
     *
     * @private
     */
    _getBeforeRemovingPasses() {
        return this._sortPasses(this._beforeRemovingPasses);
    }

    /**
     * @returns {IterableIterator<Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface>}
     *
     * @private
     */
    _getRemovingPasses() {
        return this._sortPasses(this._removingPasses);
    }

    /**
     * @returns {IterableIterator<Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface>}
     *
     * @private
     */
    _getAfterRemovingPasses() {
        return this._sortPasses(this._afterRemovingPasses);
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface[]} passes
     *
     * @returns {IterableIterator<Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface>}
     *
     * @private
     */
    * _sortPasses(passes) {
        const keys = Object.keys(passes);
        if (0 === keys.length) {
            return;
        }

        keys.sort().reverse();
        for (const priority of keys) {
            yield * passes[priority];
        }
    }
}

PassConfig.TYPE_AFTER_REMOVING = 'afterRemoving';
PassConfig.TYPE_BEFORE_OPTIMIZATION = 'beforeOptimization';
PassConfig.TYPE_BEFORE_REMOVING = 'beforeRemoving';
PassConfig.TYPE_OPTIMIZE = 'optimization';
PassConfig.TYPE_REMOVE = 'removing';

module.exports = PassConfig;
