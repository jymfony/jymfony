const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.ExtensionCompilerPass}
 */
module.exports = class ExtensionCompilerPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        for (let extension of Object.values(container.getExtensions())) {
            if (extension instanceof CompilerPassInterface) {
                extension.process(container);
            }
        }
    }
};
