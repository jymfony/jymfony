const Bundle = Jymfony.Component.Kernel.Bundle;

const AddConsoleCommandPass = Jymfony.Component.Console.DependencyInjection.AddConsoleCommandPass;

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
        container
            .addCompilerPass(new RegisterListenerPass())
            .addCompilerPass(new AddConsoleCommandPass())
        ;
    }
}

module.exports = FrameworkBundle;
