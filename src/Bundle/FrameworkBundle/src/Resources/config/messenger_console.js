/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Container = Jymfony.Component.DependencyInjection.Container;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('console.command.messenger_consume_messages', Jymfony.Component.Messenger.Command.ConsumeMessagesCommand)
    .setArguments([
        null,
        new Reference('messenger.receiver_locator'),
        new Reference('event_dispatcher'),
        new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE),
        [], // Receiver names
        [], // Bus names
    ])
    .addTag('jymfony.logger', { channel: 'messenger' })
    .setAutoconfigured(true);

container.register('console.command.messenger_debug', Jymfony.Component.Messenger.Command.DebugCommand)
    .setArguments([
        [], // Message to handlers mapping
    ])
    .setAutoconfigured(true);

container.register('console.command.messenger_setup_transports', Jymfony.Component.Messenger.Command.SetupTransportsCommand)
    .setArguments([
        new Reference('messenger.receiver_locator'),
        [], // Receiver names
    ])
    .setAutoconfigured(true);

container.register('console.command.messenger_stop_workers', Jymfony.Component.Messenger.Command.StopWorkersCommand)
    .setArguments([
        new Reference('cache.messenger.restart_workers_signal'),
    ])
    .setAutoconfigured(true);
