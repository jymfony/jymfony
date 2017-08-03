const Bundle = Jymfony.Component.Kernel.Bundle;

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
    }
}

module.exports = FrameworkBundle;
