declare namespace Jymfony.Component.EventDispatcher.DependencyInjection.Compiler {
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class RegisterListenerPass extends implementationOf(CompilerPassInterface) {
        /**
         * Constructor.
         *
         * @param {string} [dispatcherService = 'event_dispatcher']
         * @param {string} [listenerTag = 'kernel.event_listener']
         * @param {string} [subscriberTag = 'kernel.event_subscriber']
         */
        __construct(dispatcherService?: string, listenerTag?: string, subscriberTag?: string): void;

        /**
         * @inheritdoc
         */
        process(container: ContainerBuilder): void;
    }
}
