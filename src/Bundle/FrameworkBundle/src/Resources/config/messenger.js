/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Container = Jymfony.Component.DependencyInjection.Container;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const TaggedIteratorArgument = Jymfony.Component.DependencyInjection.Argument.TaggedIteratorArgument;

container.setAlias(Jymfony.Component.Messenger.Transport.Serialization.SerializerInterface, 'messenger.default_serializer');

container.register('messenger.senders_locator', Jymfony.Component.Messenger.Transport.Sender.SendersLocator)
    .setArguments([ null, null ]);

container.register('messenger.middleware.send_message', Jymfony.Component.Messenger.Middleware.SendMessageMiddleware)
    .setAbstract(true)
    .setArguments([
        new Reference('messenger.senders_locator'),
        new Reference('event_dispatcher'),
    ])
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
    .addTag('jymfony.logger', { channel: 'messenger' });


container.register('messenger.transport.native_js_serializer', Jymfony.Component.Messenger.Transport.Serialization.NativeSerializer);

// Middleware
container.register('messenger.middleware.handle_message', Jymfony.Component.Messenger.Middleware.HandleMessageMiddleware)
    .setAbstract(true)
    .setArguments([ null ])
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ]);

container.register('messenger.middleware.add_bus_name_stamp_middleware', Jymfony.Component.Messenger.Middleware.AddBusNameStampMiddleware)
    .setAbstract(true);

container.register('messenger.middleware.dispatch_after_current_bus', Jymfony.Component.Messenger.Middleware.DispatchAfterCurrentBusMiddleware)
    .setAbstract(true);

container.register('messenger.middleware.validation', Jymfony.Component.Messenger.Middleware.ValidationMiddleware)
    .setAbstract(true)
    .setArguments([ new Reference('validator') ]);

container.register('messenger.middleware.failed_message_processing_middleware', Jymfony.Component.Messenger.Middleware.FailedMessageProcessingMiddleware)
    .setAbstract(true);

container.register('messenger.middleware.traceable', Jymfony.Component.Messenger.Middleware.TraceableMiddleware)
    .setAbstract(true)
    .setArguments([
        new Reference('debug.stopwatch'),
    ]);

// Discovery
container.register('messenger.receiver_locator', Jymfony.Component.DependencyInjection.ServiceLocator)
    .setArguments([
        [],
    ])
    .addTag('container.service_locator');

// Transports
container.register('messenger.transport_factory', Jymfony.Component.Messenger.Transport.TransportFactory)
    .setArguments([
        new TaggedIteratorArgument('messenger.transport_factory'),
    ]);

container.register('messenger.transport.sync.factory', Jymfony.Component.Messenger.Transport.Sync.SyncTransportFactory)
    .addProperty('_messageBus', new Reference('messenger.routable_message_bus'))
    .addTag('messenger.transport_factory');

container.register('messenger.transport.in_memory.factory', Jymfony.Component.Messenger.Transport.InMemoryTransportFactory)
    .addTag('messenger.transport_factory');

// Retry
container.register('messenger.retry_strategy_locator', Jymfony.Component.DependencyInjection.ServiceLocator)
    .setArguments([
        [],
    ])
    .addTag('container.service_locator');

container.register('messenger.retry.abstract_multiplier_retry_strategy', Jymfony.Component.Messenger.Retry.MultiplierRetryStrategy)
    .setAbstract(true)
    .setArguments([
        null, // Max retries
        null, // Delay ms
        null, // Multiplier
        null, // Max delay ms
    ]);

// Worker event listener
container.register('messenger.retry.send_failed_message_for_retry_listener', Jymfony.Component.Messenger.EventListener.SendFailedMessageForRetryListener)
    .setArguments([
        null, // Senders service locator,
        new Reference('messenger.retry_strategy_locator'),
        new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE),
        new Reference('event_dispatcher'),
    ])
    .addTag('kernel.event_subscriber')
    .addTag('jymfony.logger', { channel: 'messenger' });

container.register('messenger.failure.add_error_details_stamp_listener', Jymfony.Component.Messenger.EventListener.AddErrorDetailsStampListener)
    .addTag('kernel.event_subscriber');

container.register('messenger.failure.send_failed_message_to_failure_transport_listener', Jymfony.Component.Messenger.EventListener.SendFailedMessageToFailureTransportListener)
    .setArguments([
        null, // Failure transports
        new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE),
    ])
    .addTag('kernel.event_subscriber')
    .addTag('jymfony.logger', { channel: 'messenger' });

container.register('messenger.listener.stop_worker_on_restart_signal_listener', Jymfony.Component.Messenger.EventListener.StopWorkerOnRestartSignalListener)
    .setArguments([
        new Reference('cache.messenger.restart_workers_signal'),
        new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE),
    ])
    .addTag('kernel.event_subscriber')
    .addTag('jymfony.logger', { channel: 'messenger' });

container.register('messenger.listener.stop_worker_on_sigterm_signal_listener', Jymfony.Component.Messenger.EventListener.StopWorkerOnSigtermSignalListener)
    .setArguments([
        new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE),
    ])
    .addTag('kernel.event_subscriber');

container.register('messenger.listener.stop_worker_on_stop_exception_listener', Jymfony.Component.Messenger.EventListener.StopWorkerOnCustomStopExceptionListener)
    .addTag('kernel.event_subscriber');

container.register('messenger.routable_message_bus', Jymfony.Component.Messenger.RoutableMessageBus)
    .setArguments([
        null,
        new Reference('messenger.default_bus'),
    ]);

container.register('console.command.messenger_consume_messages', Jymfony.Component.Messenger.Command.ConsumeMessagesCommand)
    .setArguments([
        null,
        new Reference('messenger.receiver_locator'),
        new Reference('event_dispatcher'),
        new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE),
        [], // Receiver names
        [], // Bus names
    ])
    .addTag('console.command')
    .addTag('jymfony.logger', { channel: 'messenger' });

container.register('console.command.messenger_setup_transports', Jymfony.Component.Messenger.Command.SetupTransportsCommand)
    .setArguments([
        new Reference('messenger.receiver_locator'),
        [], // Receiver names
    ])
    .addTag('console.command');

container.register('console.command.messenger_stop_workers', Jymfony.Component.Messenger.Command.StopWorkersCommand)
    .setArguments([
        new Reference('cache.messenger.restart_workers_signal'),
    ])
    .addTag('console.command');
