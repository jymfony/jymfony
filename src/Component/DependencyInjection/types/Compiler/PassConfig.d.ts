declare namespace Jymfony.Component.DependencyInjection.Compiler {
    export class PassConfig {
        static readonly TYPE_AFTER_REMOVING = 'afterRemoving';
        static readonly TYPE_BEFORE_OPTIMIZATION = 'beforeOptimization';
        static readonly TYPE_BEFORE_REMOVING = 'beforeRemoving';
        static readonly TYPE_OPTIMIZE = 'optimization';
        static readonly TYPE_REMOVE = 'removing';

        private _mergePass: MergeExtensionConfigurationPass;
        private _beforeOptimizationPasses: Record<number, CompilerPassInterface[]>;
        private _optimizationPasses: Record<number, CompilerPassInterface[]>;
        private _beforeRemovingPasses: Record<number, CompilerPassInterface[]>;
        private _removingPasses: Record<number, CompilerPassInterface[]>;
        private _afterRemovingPasses: Record<number, CompilerPassInterface[]>;

        /**
         * Add a compilation pass
         */
        addPass(pass: CompilerPassInterface, type: string, priority: number): void;

        /**
         * Gets all the compiler passes.
         */
        getPasses(): IterableIterator<CompilerPassInterface>;

        private _getBeforeOptimizationPasses(): IterableIterator<CompilerPassInterface>;
        private _getOptimizationPasses(): IterableIterator<CompilerPassInterface>;
        private _getBeforeRemovingPasses(): IterableIterator<CompilerPassInterface>;
        private _getRemovingPasses(): IterableIterator<CompilerPassInterface>;
        private _getAfterRemovingPasses(): IterableIterator<CompilerPassInterface>;
        private _sortPasses(passes: CompilerPassInterface[]): IterableIterator<CompilerPassInterface>;
    }
}
