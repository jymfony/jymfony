const Bundle = Jymfony.Component.Kernel.Bundle;
const PassConfig = Jymfony.Component.DependencyInjection.Compiler.PassConfig;
const RegisterListenerPass = Jymfony.Component.EventDispatcher.DependencyInjection.Compiler.RegisterListenerPass;
const RoutingResolverPass = Jymfony.Component.Routing.DependencyInjection.RoutingResolverPass;
const AddCacheWarmerPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.AddCacheWarmerPass;
const LoggerChannelPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.LoggerChannelPass;
const TestServiceContainerRealRefPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.TestServiceContainerRealRefPass;
const TestServiceContainerWeakRefPass = Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.TestServiceContainerWeakRefPass;
const AddConsoleCommandPass = Jymfony.Component.Console.DependencyInjection.AddConsoleCommandPass;
const AddCacheClearerPass = Jymfony.Component.Kernel.DependencyInjection.AddCacheClearerPass;

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
            .addCompilerPass(new AddCacheWarmerPass())
            .addCompilerPass(new AddConsoleCommandPass())
            .addCompilerPass(new RegisterListenerPass(), PassConfig.TYPE_BEFORE_REMOVING)
            .addCompilerPass(new AddCacheClearerPass())
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
     * @inheritdoc
     */
    async boot() {
        if (this._container.hasParameter('jymfony.logger.mongodb.connections')) {
            const MongoClient = require('mongodb').MongoClient;

            for (const [ name, url ] of this._container.getParameter('jymfony.logger.mongodb.connections')) {
                this._container.set('jymfony.logger.mongodb.connection.'+name, await MongoClient.connect(
                    this._container.parameterBag.resolveValue(url, true)
                ));
            }
        }
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
        for (const handler of logger.handlers) {
            await handler.close();
        }
    }
}

module.exports = FrameworkBundle;
