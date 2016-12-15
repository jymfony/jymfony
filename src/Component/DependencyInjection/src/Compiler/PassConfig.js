const Compiler = Jymfony.DependencyInjection.Compiler;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 */
module.exports = class PassConfig {
    constructor() {
        this._mergePass = new Compiler.MergeExtensionConfigurationPass();

        this._beforeOptimizationPasses = {
            0: [
                new Compiler.ExtensionCompilerPass(),
                new Compiler.ResolveDefinitionTemplatesPass(),
                new Compiler.DecoratorServicePass(),
                new Compiler.ResolveParameterPlaceHoldersPass(),
                new Compiler.CheckDefinitionValidityPass(),
                new Compiler.ResolveReferencesToAliasesPass(),
                new Compiler.ResolveInvalidReferencesPass(),
                new Compiler.AnalyzeServiceReferencesPass(true),
                new Compiler.CheckCircularReferencesPass(),
                new Compiler.CheckReferenceValidityPass()
            ]
        };

        this._optimizationPasses = {};
        this._beforeRemovingPasses = {};

        this._removingPasses = {
            0: [
                new Compiler.RemovePrivateAliasesPass(),
                new Compiler.ReplaceAliasByActualDefinitionPass(),
                new Compiler.RemoveAbstractDefinitionsPass(),
                new Compiler.RepeatedPass([
                    new Compiler.AnalyzeServiceReferencesPass(),
                    new Compiler.InlineServiceDefinitionsPass(),
                    new Compiler.AnalyzeServiceReferencesPass(),
                    new Compiler.RemoveUnusedDefinitionsPass()
                ]),
                new Compiler.CheckExceptionOnInvalidReferenceBehaviorPass(),
            ]
        };

        this._afterRemovingPasses = {};
    }

    /**
     * Add a compilation pass
     *
     * @param {CompilerPassInterface} pass
     * @param type
     * @param {int} priority
     */
    addPass(pass, type, priority) {
        let property = '_' + type + 'Passes';
        if (! this.hasOwnProperty(property)) {
            throw new InvalidArgumentException('Invalid type ' + type);
        }

        let collection = this[property];
        if (! collection[priority]) {
            collection[priority] = [];
        }

        collection.priority.push(pass);
    }

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

    _getBeforeOptimizationPasses() {
        return this._sortPasses(this._beforeOptimizationPasses);
    }

    _getOptimizationPasses() {
        return this._sortPasses(this._optimizationPasses);
    }

    _getBeforeRemovingPasses() {
        return this._sortPasses(this._beforeRemovingPasses);
    }

    _getRemovingPasses() {
        return this._sortPasses(this._removingPasses);
    }

    _getAfterRemovingPasses() {
        return this._sortPasses(this._afterRemovingPasses);
    }

    * _sortPasses(passes) {
        let keys = Object.keys(passes);
        if (0 === keys.length) {
            return;
        }

        keys.sort().reverse();
        for (let priority of keys) {
            yield * passes[priority];
        }
    }
};

PassConfig.TYPE_AFTER_REMOVING = 'afterRemoving';
PassConfig.TYPE_BEFORE_OPTIMIZATION = 'beforeOptimization';
PassConfig.TYPE_BEFORE_REMOVING = 'beforeRemoving';
PassConfig.TYPE_OPTIMIZE = 'optimization';
PassConfig.TYPE_REMOVE = 'removing';
