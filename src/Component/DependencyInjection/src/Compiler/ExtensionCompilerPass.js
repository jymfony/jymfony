const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @type {Jymfony.Component.DependencyInjection.Compiler.ExtensionCompilerPass}
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
