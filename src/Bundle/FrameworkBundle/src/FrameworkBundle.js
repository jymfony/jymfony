const Bundle = Jymfony.Component.Kernel.Bundle;
const RegisterListenerPass = Jymfony.Component.EventDispatcher.DependencyInjection.Compiler.RegisterListenerPass;
const AddCacheWarmerPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Component.AddCacheWarmerPass;
/**
 * Bundle
 *
 * @memberOf Jymfony.FrameworkBundle
 */
class FrameworkBundle extends implementationOf(Bundle) {
    boot() {

    }

    /**
     * Builds the bundle
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    build(container) {
        container.addCompilerPass(new RegisterListenerPass());
        container.addCompilerPass(new AddCacheWarmerPass());
    }
}

module.exports = FrameworkBundle;
