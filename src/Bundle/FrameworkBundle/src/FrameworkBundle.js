const Bundle = Jymfony.Component.Kernel.Bundle;
const PassConfig = Jymfony.Component.DependencyInjection.Compiler.PassConfig;
const RegisterListenerPass = Jymfony.Component.EventDispatcher.DependencyInjection.Compiler.RegisterListenerPass;
const RoutingResolverPass = Jymfony.Component.Routing.DependencyInjection.RoutingResolverPass;
const LoggerChannelPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.LoggerChannelPass;
const TestServiceContainerRealRefPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.TestServiceContainerRealRefPass;
const TestServiceContainerWeakRefPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.TestServiceContainerWeakRefPass;
const AddConsoleCommandPass = Jymfony.Component.Console.DependencyInjection.AddConsoleCommandPass;

/**
 * FrameworkBundle.
 *
 * @memberOf Jymfony.Bundle.FrameworkBundle
 */
class FrameworkBundle extends Bundle {
    /**
     * @inheritdoc
     */
    build(container) {
        container
            .addCompilerPass(new AddConsoleCommandPass())
            .addCompilerPass(new RegisterListenerPass(), PassConfig.TYPE_BEFORE_REMOVING)
            .addCompilerPass(new RoutingResolverPass())
            .addCompilerPass(new LoggerChannelPass())
            .addCompilerPass(new TestServiceContainerWeakRefPass(), PassConfig.TYPE_BEFORE_REMOVING, -32)
            .addCompilerPass(new TestServiceContainerRealRefPass(), PassConfig.TYPE_AFTER_REMOVING)
        ;
    }

    /**
     * @inheritdoc
     */
    async shutdown() {
        await this._closeLogger();
    }

    /**
     * Closes all the logger handlers.
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _closeLogger() {
        if (! this._container.has('jymfony.logger')) {
            return;
        }

        const logger = this._container.get('jymfony.logger');
        await Promise.all(logger.handlers.map(handler => handler.close()));
    }
}

module.exports = FrameworkBundle;
