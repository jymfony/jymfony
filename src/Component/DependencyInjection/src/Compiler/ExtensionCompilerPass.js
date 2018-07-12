const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class ExtensionCompilerPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        for (const extension of Object.values(container.getExtensions())) {
            if (extension instanceof CompilerPassInterface) {
                extension.process(container);
            }
        }
    }
}

module.exports = ExtensionCompilerPass;
