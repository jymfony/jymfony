const Bundle = Jymfony.Component.Kernel.Bundle;
const RegisterListenerPass = Jymfony.Component.EventDispatcher.DependencyInjection.Compiler.RegisterListenerPass;
const AddCacheWarmerPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.AddCacheWarmerPass;
const AddConsoleCommandPass = Jymfony.Component.Console.DependencyInjection.AddConsoleCommandPass;
const AddCacheClearerPass = Jymfony.Component.Kernel.DependencyInjection.AddCacheClearerPass;


/**
 * Bundle
 *
 * @memberOf Jymfony.Bundle.FrameworkBundle
 */
class FrameworkBundle extends Bundle {
    /**
     * Builds the bundle
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    build(container) {
        container
            .addCompilerPass(new AddCacheWarmerPass())
            .addCompilerPass(new AddConsoleCommandPass())
            .addCompilerPass(new RegisterListenerPass())
            .addCompilerPass(new AddCacheClearerPass())
        ;
    }
}

module.exports = FrameworkBundle;
