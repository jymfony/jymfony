const AnnotationAutoconfigurationPass = Jymfony.Component.DependencyInjection.Compiler.AnnotationAutoconfigurationPass;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const ConsumeMessagesCommand = Jymfony.Component.Messenger.Command.ConsumeMessagesCommand;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const DebugCommand = Jymfony.Component.Messenger.Command.DebugCommand;
const DummyCommand = Jymfony.Component.Messenger.Fixtures.DummyCommand;
const DummyCommandHandler = Jymfony.Component.Messenger.Fixtures.DummyCommandHandler;
const DummyHandler = Jymfony.Component.Messenger.Fixtures.DummyHandler;
const DummyMessage = Jymfony.Component.Messenger.Fixtures.DummyMessage;
const DummyQuery = Jymfony.Component.Messenger.Fixtures.DummyQuery;
const DummyQueryHandler = Jymfony.Component.Messenger.Fixtures.DummyQueryHandler;
const DummyReceiver = Jymfony.Component.Messenger.Fixtures.DummyReceiver;
const DummyHandlerWithCustomMethods = Jymfony.Component.Messenger.Fixtures.DummyHandlerWithCustomMethods;
const FailedMessagesRetryCommand = Jymfony.Component.Messenger.Command.FailedMessagesRetryCommand;
const FailedMessagesShowCommand = Jymfony.Component.Messenger.Command.FailedMessagesShowCommand;
const HandleMessageMiddleware = Jymfony.Component.Messenger.Middleware.HandleMessageMiddleware;
const HandleNoMessageHandler = Jymfony.Component.Messenger.Fixtures.HandleNoMessageHandler;
const HandlerMappingMethods = Jymfony.Component.Messenger.Fixtures.HandlerMappingMethods;
const HandlerMappingWithNonExistentMethod = Jymfony.Component.Messenger.Fixtures.HandlerMappingWithNonExistentMethod;
const HandlerOnSpecificBuses = Jymfony.Component.Messenger.Fixtures.HandlerOnSpecificBuses;
const HandlerOnUndefinedBus = Jymfony.Component.Messenger.Fixtures.HandlerOnUndefinedBus;
const HandlerWithGenerators = Jymfony.Component.Messenger.Fixtures.HandlerWithGenerators;
const HandlerWithMultipleMessages = Jymfony.Component.Messenger.Fixtures.HandlerWithMultipleMessages;
const HandlersLocator = Jymfony.Component.Messenger.Handler.HandlersLocator;
const MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;
const MessageHandler = Jymfony.Component.Messenger.Annotation.MessageHandler;
const MessengerPass = Jymfony.Component.Messenger.DependencyInjection.MessengerPass;
const MissingArgumentHandler = Jymfony.Component.Messenger.Fixtures.MissingArgumentHandler;
const MissingArgumentTypeHandler = Jymfony.Component.Messenger.Fixtures.MissingArgumentTypeHandler;
const MultipleBusesMessage = Jymfony.Component.Messenger.Fixtures.MultipleBusesMessage;
const MultipleBusesMessageHandler = Jymfony.Component.Messenger.Fixtures.MultipleBusesMessageHandler;
const NotInvokableHandler = Jymfony.Component.Messenger.Fixtures.NotInvokableHandler;
const PrioritizedHandler = Jymfony.Component.Messenger.Fixtures.PrioritizedHandler;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const ResolveChildDefinitionsPass = Jymfony.Component.DependencyInjection.Compiler.ResolveChildDefinitionsPass;
const ResolveClassPass = Jymfony.Component.DependencyInjection.Compiler.ResolveClassPass;
const ResolveInstanceofConditionalsPass = Jymfony.Component.DependencyInjection.Compiler.ResolveInstanceofConditionalsPass;
const SecondMessage = Jymfony.Component.Messenger.Fixtures.SecondMessage;
const ServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;
const SetupTransportsCommand = Jymfony.Component.Messenger.Command.SetupTransportsCommand;
const TaggedDummyHandler = Jymfony.Component.Messenger.Fixtures.TaggedDummyHandler;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const UndefinedMessageHandler = Jymfony.Component.Messenger.Fixtures.UndefinedMessageHandler;
const UndefinedMessageHandlerViaHandlerInterface = Jymfony.Component.Messenger.Fixtures.UndefinedMessageHandlerViaHandlerInterface;
const UndefinedMessageHandlerViaSubscriberInterface = Jymfony.Component.Messenger.Fixtures.UndefinedMessageHandlerViaSubscriberInterface;
const UselessMiddleware = Jymfony.Component.Messenger.Fixtures.UselessMiddleware;

export default class MessengerPassTest extends TestCase {
    get testCaseName() {
        return '[Messenger] ' + super.testCaseName;
    }

    testProcess() {
        const busId = 'message_bus';
        const container = this.getContainerBuilder(busId);
        container
            .register(DummyHandler, DummyHandler)
            .addTag('messenger.message_handler')
        ;
        container
            .register(MissingArgumentTypeHandler, MissingArgumentTypeHandler)
            .addTag('messenger.message_handler', { handles: ReflectionClass.getClassName(SecondMessage) })
        ;
        container
            .register(DummyReceiver, DummyReceiver)
            .addTag('messenger.receiver')
        ;

        (new MessengerPass()).process(container);

        __self.assertFalse(container.hasDefinition('messenger.middleware.debug.logging'));

        const handlersLocatorDefinition = container.getDefinition(busId + '.messenger.handlers_locator');
        __self.assertEquals(ReflectionClass.getClassName(HandlersLocator), handlersLocatorDefinition.getClass());

        const handlerDescriptionMapping = handlersLocatorDefinition.getArgument(0);
        __self.assertCount(2, handlerDescriptionMapping);

        this.assertHandlerDescriptor(container, handlerDescriptionMapping, DummyMessage, [ DummyHandler ]);
        this.assertHandlerDescriptor(container, handlerDescriptionMapping, SecondMessage, [ MissingArgumentTypeHandler ]);

        __self.assertEquals(
            { [ReflectionClass.getClassName(DummyReceiver)]: new Reference(DummyReceiver) },
            container.getDefinition('messenger.receiver_locator').getArgument(0)
        );
    }

    testFromTransportViaTagAttribute() {
        const busId = 'message_bus';
        const container = this.getContainerBuilder(busId);
        container
            .register(DummyHandler, DummyHandler)
            .addTag('messenger.message_handler', { from_transport: 'async' })
        ;

        (new MessengerPass()).process(container);

        const handlersLocatorDefinition = container.getDefinition(busId + '.messenger.handlers_locator');
        __self.assertSame(ReflectionClass.getClassName(HandlersLocator), handlersLocatorDefinition.getClass());

        const handlerDescriptionMapping = handlersLocatorDefinition.getArgument(0);
        __self.assertCount(1, handlerDescriptionMapping);

        this.assertHandlerDescriptor(container, handlerDescriptionMapping, DummyMessage, [ DummyHandler ], [ { from_transport: 'async' } ]);
    }

    testHandledMessageTypeResolvedWithMethodAndNoHandlesViaTagAttributes() {
        const busId = 'message_bus';
        const container = this.getContainerBuilder();
        container
            .register(DummyHandlerWithCustomMethods, DummyHandlerWithCustomMethods)
            .addTag('messenger.message_handler', {
                method: 'handleDummyMessage',
            })
            .addTag('messenger.message_handler', {
                method: 'handleSecondMessage',
            });

        (new MessengerPass()).process(container);

        const handlersMapping = container.getDefinition(busId + '.messenger.handlers_locator').getArgument(0);

        __self.assertHasKey(ReflectionClass.getClassName(DummyMessage), handlersMapping);
        this.assertHandlerDescriptor(
            container,
            handlersMapping,
            DummyMessage,
            [ [ DummyHandlerWithCustomMethods, 'handleDummyMessage' ] ]
        );

        __self.assertHasKey(ReflectionClass.getClassName(SecondMessage), handlersMapping);
        this.assertHandlerDescriptor(
            container,
            handlersMapping,
            SecondMessage,
            [ [ DummyHandlerWithCustomMethods, 'handleSecondMessage' ] ]
        );
    }

    testTaggedMessageHandler() {
        const busId = 'message_bus';
        const container = this.getContainerBuilder(busId);
        container.registerAnnotationForAutoconfiguration(MessageHandler, (definition, attribute) => definition.addTag('messenger.message_handler', attribute.asTag));
        container
            .register(TaggedDummyHandler, TaggedDummyHandler)
            .setAutoconfigured(true)
        ;

        (new AnnotationAutoconfigurationPass()).process(container);
        (new ResolveInstanceofConditionalsPass()).process(container);
        (new MessengerPass()).process(container);

        const handlersLocatorDefinition = container.getDefinition(busId + '.messenger.handlers_locator');
        __self.assertSame(ReflectionClass.getClassName(HandlersLocator), handlersLocatorDefinition.getClass());

        const handlerDescriptionMapping = handlersLocatorDefinition.getArgument(0);
        __self.assertCount(1, handlerDescriptionMapping);

        this.assertHandlerDescriptor(container, handlerDescriptionMapping, DummyMessage, [ TaggedDummyHandler ]);
    }

    testProcessHandlersByBus() {
        const commandBusId = 'command_bus';
        const queryBusId = 'query_bus';

        const container = this.getContainerBuilder(commandBusId);
        container.register(queryBusId, MessageBusInterface).setArgument(0, []).addTag('messenger.bus');
        container.register('messenger.middleware.handle_message', HandleMessageMiddleware)
            .addArgument(null)
            .setAbstract(true)
        ;

        const middlewareHandlers = [ { id: 'handle_message' } ];

        container.setParameter(commandBusId + '.middleware', middlewareHandlers);
        container.setParameter(queryBusId + '.middleware', middlewareHandlers);

        container.register(DummyCommandHandler).addTag('messenger.message_handler', { bus: commandBusId });
        container.register(DummyQueryHandler).addTag('messenger.message_handler', { bus: queryBusId });
        container.register(MultipleBusesMessageHandler)
            .addTag('messenger.message_handler', { bus: commandBusId })
            .addTag('messenger.message_handler', { bus: queryBusId })
        ;

        (new ResolveClassPass()).process(container);
        (new MessengerPass()).process(container);

        const commandBusHandlersLocatorDefinition = container.getDefinition(commandBusId + '.messenger.handlers_locator');
        __self.assertSame(ReflectionClass.getClassName(HandlersLocator), commandBusHandlersLocatorDefinition.getClass());

        this.assertHandlerDescriptor(
            container,
            commandBusHandlersLocatorDefinition.getArgument(0),
            MultipleBusesMessage,
            [ MultipleBusesMessageHandler ]
        );
        this.assertHandlerDescriptor(
            container,
            commandBusHandlersLocatorDefinition.getArgument(0),
            DummyCommand,
            [ DummyCommandHandler ]
        );

        const queryBusHandlersLocatorDefinition = container.getDefinition(queryBusId + '.messenger.handlers_locator');
        __self.assertSame(ReflectionClass.getClassName(HandlersLocator), queryBusHandlersLocatorDefinition.getClass());
        this.assertHandlerDescriptor(
            container,
            queryBusHandlersLocatorDefinition.getArgument(0),
            DummyQuery,
            [ DummyQueryHandler ]
        );
        this.assertHandlerDescriptor(
            container,
            queryBusHandlersLocatorDefinition.getArgument(0),
            MultipleBusesMessage,
            [ MultipleBusesMessageHandler ]
        );
    }

    testProcessTagWithUnknownBus() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid handler service "Jymfony.Component.Messenger.Fixtures.DummyCommandHandler": bus "unknown_bus" specified on the tag "messenger.message_handler" does not exist (known ones are: "command_bus").');
        const commandBusId = 'command_bus';
        const container = this.getContainerBuilder(commandBusId);

        container.register(DummyCommandHandler).addTag('messenger.message_handler', { bus: 'unknown_bus' });

        (new ResolveClassPass()).process(container);
        (new MessengerPass()).process(container);
    }

    testGetClassesFromTheHandlerSubscriberInterface() {
        const busId = 'message_bus';
        const container = this.getContainerBuilder();
        container
            .register(HandlerWithMultipleMessages, HandlerWithMultipleMessages)
            .addTag('messenger.message_handler')
        ;
        container
            .register(PrioritizedHandler, PrioritizedHandler)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);

        const handlersMapping = container.getDefinition(busId + '.messenger.handlers_locator').getArgument(0);

        __self.assertHasKey(ReflectionClass.getClassName(DummyMessage), handlersMapping);
        this.assertHandlerDescriptor(container, handlersMapping, DummyMessage, [ HandlerWithMultipleMessages ]);

        __self.assertHasKey(ReflectionClass.getClassName(SecondMessage), handlersMapping);
        this.assertHandlerDescriptor(container, handlersMapping, SecondMessage, [ PrioritizedHandler, HandlerWithMultipleMessages ], [ { priority: 10 } ]);
    }

    testGetClassesAndMethodsAndPrioritiesFromTheSubscriber() {
        const busId = 'message_bus';
        const container = this.getContainerBuilder(busId);
        container
            .register(HandlerMappingMethods, HandlerMappingMethods)
            .addTag('messenger.message_handler')
        ;
        container
            .register(PrioritizedHandler, PrioritizedHandler)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);

        const handlersMapping = container.getDefinition(busId + '.messenger.handlers_locator').getArgument(0);

        __self.assertHasKey(ReflectionClass.getClassName(DummyMessage), handlersMapping);
        __self.assertHasKey(ReflectionClass.getClassName(SecondMessage), handlersMapping);

        const dummyHandlerDescriptorReference = handlersMapping[ReflectionClass.getClassName(DummyMessage)].values[0];
        const dummyHandlerDescriptorDefinition = container.getDefinition(dummyHandlerDescriptorReference);

        const dummyHandlerReference = dummyHandlerDescriptorDefinition.getArgument(0);
        const dummyHandlerDefinition = container.getDefinition(dummyHandlerReference);

        __self.assertSame('BoundFunction', dummyHandlerDefinition.getClass());
        __self.assertEquals([ new Reference(HandlerMappingMethods), 'dummyMethod' ], dummyHandlerDefinition.getArgument(0));
        __self.assertSame('getCallableFromArray', dummyHandlerDefinition.getFactory());

        const secondHandlerDescriptorReference = handlersMapping[ReflectionClass.getClassName(SecondMessage)].values[1];
        const secondHandlerDescriptorDefinition = container.getDefinition(secondHandlerDescriptorReference);

        const secondHandlerReference = secondHandlerDescriptorDefinition.getArgument(0);
        const secondHandlerDefinition = container.getDefinition(secondHandlerReference);
        __self.assertSame('BoundFunction', secondHandlerDefinition.getClass());
        __self.assertEquals([ new Reference(PrioritizedHandler), '__invoke' ], secondHandlerDefinition.getArgument(0));
    }

    testRegisterAbstractHandler() {
        const messageBusId = 'message_bus';
        const container = this.getContainerBuilder(messageBusId);
        container.register(messageBusId, MessageBusInterface).addTag('messenger.bus').setArgument(0, []);

        container
            .register(DummyHandler, DummyHandler)
            .setAbstract(true);

        const abstractDirectChildId = 'direct_child';
        container
            .setDefinition(abstractDirectChildId, new ChildDefinition(DummyHandler))
            .setAbstract(true);

        const abstractHandlerId = 'child';
        container
            .setDefinition(abstractHandlerId, new ChildDefinition(abstractDirectChildId))
            .addTag('messenger.message_handler');

        (new MessengerPass()).process(container);

        const messageHandlerMapping = container.getDefinition(messageBusId + '.messenger.handlers_locator').getArgument(0);
        this.assertHandlerDescriptor(
            container,
            messageHandlerMapping,
            DummyMessage,
            [ abstractHandlerId ]
        );
    }

    testThrowsExceptionIfTheHandlerClassDoesNotExist() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid service "NonExistentHandlerClass": class "NonExistentHandlerClass" does not exist.');

        const container = this.getContainerBuilder();
        container.register('message_bus', MessageBusInterface).addTag('messenger.bus');
        container
            .register('NonExistentHandlerClass', 'NonExistentHandlerClass')
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);
    }

    testThrowsExceptionIfTheHandlerMethodDoesNotExist() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid handler service "Jymfony.Component.Messenger.Fixtures.HandlerMappingWithNonExistentMethod": method "Jymfony.Component.Messenger.Fixtures.HandlerMappingWithNonExistentMethod.dummyMethod()" does not exist.');

        const container = this.getContainerBuilder();
        container.register('message_bus', MessageBusInterface).addTag('messenger.bus');
        container
            .register(HandlerMappingWithNonExistentMethod, HandlerMappingWithNonExistentMethod)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);
    }

    testItRegistersReceivers() {
        const container = this.getContainerBuilder();
        container.register('message_bus', MessageBusInterface).addTag('messenger.bus');
        container.register(DummyReceiver, DummyReceiver).addTag('messenger.receiver', { alias: 'amqp' });

        (new MessengerPass()).process(container);

        __self.assertEquals({
            amqp: new Reference(DummyReceiver),
            [ReflectionClass.getClassName(DummyReceiver)]: new Reference(DummyReceiver),
        }, container.getDefinition('messenger.receiver_locator').getArgument(0));
    }

    testItRegistersReceiversWithoutTagName() {
        const container = this.getContainerBuilder();
        container.register('message_bus', MessageBusInterface).addTag('messenger.bus');
        container.register(DummyReceiver, DummyReceiver).addTag('messenger.receiver');

        (new MessengerPass()).process(container);

        __self.assertEquals({ [ReflectionClass.getClassName(DummyReceiver)]: new Reference(DummyReceiver) }, container.getDefinition('messenger.receiver_locator').getArgument(0));
    }

    testItRegistersMultipleReceiversAndSetsTheReceiverNamesOnTheCommand() {
        const container = this.getContainerBuilder();
        container.register('console.command.messenger_consume_messages', ConsumeMessagesCommand).setArguments([
            null,
            new Reference('messenger.receiver_locator'),
            null,
            null,
            null,
            null,
        ]);

        container.register('dummy_receiver', DummyReceiver).addTag('messenger.receiver', { alias: 'amqp' });
        container.register('dummy_receiver_2', DummyReceiver).addTag('messenger.receiver', { alias: 'dummy' });

        (new MessengerPass()).process(container);

        __self.assertSame([ 'amqp', 'dummy' ], container.getDefinition('console.command.messenger_consume_messages').getArgument(4));
    }

    testItSetsTheReceiverNamesOnTheSetupTransportsCommand() {
        const container = this.getContainerBuilder();
        container.register('console.command.messenger_setup_transports', SetupTransportsCommand).setArguments([
            new Reference('messenger.receiver_locator'),
            null,
            null,
            null,
            null,
            null,
        ]);

        container.register('dummy_receiver', DummyReceiver).addTag('messenger.receiver', { alias: 'amqp' });
        container.register('dummy_receiver_2', DummyReceiver).addTag('messenger.receiver', { alias: 'dummy' });

        (new MessengerPass()).process(container);

        __self.assertSame([ 'amqp', 'dummy' ], container.getDefinition('console.command.messenger_setup_transports').getArgument(1));
    }

    testItShouldNotThrowIfGeneratorIsReturnedInsteadOfArray() {
        const busId = 'message_bus';
        const container = this.getContainerBuilder(busId);
        container
            .register(HandlerWithGenerators, HandlerWithGenerators)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);

        const handlersMapping = container.getDefinition(busId + '.messenger.handlers_locator').getArgument(0);

        this.assertHandlerDescriptor(
            container,
            handlersMapping,
            DummyMessage,
            [ [ HandlerWithGenerators, 'dummyMethod' ] ]
        );

        this.assertHandlerDescriptor(
            container,
            handlersMapping,
            SecondMessage,
            [ [ HandlerWithGenerators, 'secondMessage' ] ]
        );
    }

    testItRegistersHandlersOnDifferentBuses() {
        const eventsBusId = 'event_bus';
        const commandsBusId = 'command_bus';
        const container = this.getContainerBuilder(eventsBusId);
        container.register(commandsBusId, MessageBusInterface).addTag('messenger.bus').setArgument(0, []);

        container
            .register(HandlerOnSpecificBuses, HandlerOnSpecificBuses)
            .addTag('messenger.message_handler');

        (new MessengerPass()).process(container);

        const eventsHandlerMapping = container.getDefinition(eventsBusId + '.messenger.handlers_locator').getArgument(0);

        this.assertHandlerDescriptor(
            container,
            eventsHandlerMapping,
            DummyMessage,
            [ [ HandlerOnSpecificBuses, 'dummyMethodForEvents' ] ],
            [ { bus: 'event_bus' } ]
        );

        const commandsHandlerMapping = container.getDefinition(commandsBusId + '.messenger.handlers_locator').getArgument(0);

        this.assertHandlerDescriptor(
            container,
            commandsHandlerMapping,
            DummyMessage,
            [ [ HandlerOnSpecificBuses, 'dummyMethodForCommands' ] ],
            [ { bus: 'command_bus' } ]
        );
    }

    testItThrowsAnExceptionOnUnknownBus() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid configuration returned by method "Jymfony.Component.Messenger.Fixtures.HandlerOnUndefinedBus.getHandledMessages()" for message "Jymfony.Component.Messenger.Fixtures.DummyMessage": bus "some_undefined_bus" does not exist.');
        const container = this.getContainerBuilder();
        container
            .register(HandlerOnUndefinedBus, HandlerOnUndefinedBus)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);
    }

    testUndefinedMessageClassForHandler() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid handler service "Jymfony.Component.Messenger.Fixtures.UndefinedMessageHandler": class or interface "UndefinedMessage" used as argument type in method "Jymfony.Component.Messenger.Fixtures.UndefinedMessageHandler.__invoke()" not found.');
        const container = this.getContainerBuilder();
        container
            .register(UndefinedMessageHandler, UndefinedMessageHandler)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);
    }

    testUndefinedMessageClassForHandlerImplementingMessageHandlerInterface() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid handler service "Jymfony.Component.Messenger.Fixtures.UndefinedMessageHandlerViaHandlerInterface": class or interface "UndefinedMessage" used as argument type in method "Jymfony.Component.Messenger.Fixtures.UndefinedMessageHandlerViaHandlerInterface.__invoke()" not found.');
        const container = this.getContainerBuilder();
        container
            .register(UndefinedMessageHandlerViaHandlerInterface, UndefinedMessageHandlerViaHandlerInterface)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);
    }

    testUndefinedMessageClassForHandlerImplementingMessageSubscriberInterface() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid handler service "Jymfony.Component.Messenger.Fixtures.UndefinedMessageHandlerViaSubscriberInterface": class or interface "UndefinedMessage" returned by method "Jymfony.Component.Messenger.Fixtures.UndefinedMessageHandlerViaSubscriberInterface.getHandledMessages()" not found.');
        const container = this.getContainerBuilder();
        container
            .register(UndefinedMessageHandlerViaSubscriberInterface, UndefinedMessageHandlerViaSubscriberInterface)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);
    }

    testNotInvokableHandler() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid handler service "Jymfony.Component.Messenger.Fixtures.NotInvokableHandler": class "Jymfony.Component.Messenger.Fixtures.NotInvokableHandler" must have a "__invoke()" method.');
        const container = this.getContainerBuilder();
        container
            .register(NotInvokableHandler, NotInvokableHandler)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);
    }

    testMissingArgumentHandler() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid handler service "Jymfony.Component.Messenger.Fixtures.MissingArgumentHandler": method "Jymfony.Component.Messenger.Fixtures.MissingArgumentHandler.__invoke()" requires at least one argument, first one being the message it handles.');
        const container = this.getContainerBuilder();
        container
            .register(MissingArgumentHandler, MissingArgumentHandler)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);
    }

    testMissingArgumentTypeHandler() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid handler service "Jymfony.Component.Messenger.Fixtures.MissingArgumentTypeHandler": argument "message" of method "Jymfony.Component.Messenger.Fixtures.MissingArgumentTypeHandler.__invoke()" must have a type decorator corresponding to the message class it handles.');
        const container = this.getContainerBuilder();
        container
            .register(MissingArgumentTypeHandler, MissingArgumentTypeHandler)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);
    }

    testNeedsToHandleAtLeastOneMessage() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid handler service "Jymfony.Component.Messenger.Fixtures.HandleNoMessageHandler": method "Jymfony.Component.Messenger.Fixtures.HandleNoMessageHandler.getHandledMessages()" must return one or more messages.');
        const container = this.getContainerBuilder();
        container
            .register(HandleNoMessageHandler, HandleNoMessageHandler)
            .addTag('messenger.message_handler')
        ;

        (new MessengerPass()).process(container);
    }

    testRegistersMiddlewareFromServices() {
        const fooBusId = 'messenger.bus.foo';
        const container = this.getContainerBuilder(fooBusId);
        container.register('middleware_with_factory', UselessMiddleware).addArgument('some_default').setAbstract(true);
        container.register('middleware_with_factory_using_default', UselessMiddleware).addArgument('some_default').setAbstract(true);
        container.register(UselessMiddleware, UselessMiddleware);

        const middlewareParameter = fooBusId + '.middleware';
        const factoryChildMiddlewareArgs1 = { 'index_0': 'foo', 1: 'bar' };
        const factoryChildMiddlewareArgs2 = { 'index_0': 'baz' };
        container.setParameter(middlewareParameter, [
            { id: ReflectionClass.getClassName(UselessMiddleware) },
            { id: 'middleware_with_factory', 'arguments': factoryChildMiddlewareArgs1 },
            { id: 'middleware_with_factory', 'arguments': factoryChildMiddlewareArgs2 },
            { id: 'middleware_with_factory_using_default' },
        ]);

        (new MessengerPass()).process(container);
        (new ResolveChildDefinitionsPass()).process(container);

        const factoryChildMiddlewareArgs1Id = fooBusId + '.middleware.middleware_with_factory';
        __self.assertTrue(container.hasDefinition(factoryChildMiddlewareArgs1Id));
        __self.assertEquals(
            [ 'foo', 'bar' ],
            container.getDefinition(factoryChildMiddlewareArgs1Id).getArguments(),
            'parent default argument is overridden, and next ones appended'
        );

        const factoryChildMiddlewareArgs2Id = fooBusId + '.middleware.middleware_with_factory.' + ContainerBuilder.hash(factoryChildMiddlewareArgs2);
        __self.assertTrue(container.hasDefinition(factoryChildMiddlewareArgs2Id));
        __self.assertEquals(
            [ 'baz' ],
            container.getDefinition(factoryChildMiddlewareArgs2Id).getArguments(),
            'parent default argument is overridden, and next ones appended'
        );

        const factoryWithDefaultChildMiddlewareId = fooBusId + '.middleware.middleware_with_factory_using_default';
        __self.assertTrue(container.hasDefinition(fooBusId));
        __self.assertEquals(
            [ 'some_default' ],
            container.getDefinition(factoryWithDefaultChildMiddlewareId).getArguments(),
            'parent default argument is used'
        );

        __self.assertEquals([
            new Reference(UselessMiddleware),
            new Reference(factoryChildMiddlewareArgs1Id),
            new Reference(factoryChildMiddlewareArgs2Id),
            new Reference(factoryWithDefaultChildMiddlewareId),
        ], container.getDefinition(fooBusId).getArgument(0).values);
        __self.assertFalse(container.hasParameter(middlewareParameter));
    }

    testCannotRegistersAnUndefinedMiddleware() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid middleware: service "not_defined_middleware" not found.');
        const fooBusId = 'messenger.bus.foo';
        const container = this.getContainerBuilder(fooBusId);
        const middlewareParameter = fooBusId + '.middleware';
        container.setParameter(middlewareParameter, [
            { id: 'not_defined_middleware', arguments: [] },
        ]);

        (new MessengerPass()).process(container);
    }

    testMiddlewareFactoryDefinitionMustBeAbstract() {
        this.expectException(RuntimeException);
        this.expectExceptionMessage('Invalid middleware factory "not_an_abstract_definition": a middleware factory must be an abstract definition.');

        const fooBusId = 'messenger.bus.foo';
        const middlewareParameter = fooBusId + '.middleware';
        const container = this.getContainerBuilder(fooBusId);
        container.register('not_an_abstract_definition', UselessMiddleware);
        container.setParameter(middlewareParameter, [
            { id: 'not_an_abstract_definition', arguments: [ 'foo' ] },
        ]);

        (new MessengerPass()).process(container);
    }

    getContainerBuilder(busId = 'message_bus') {
        const container = new ContainerBuilder();
        container.setParameter('kernel.debug', true);

        container.register(busId, MessageBusInterface).addTag('messenger.bus').setArgument(0, []);
        if ('message_bus' !== busId) {
            container.setAlias('message_bus', busId);
        }

        container.register('messenger.receiver_locator', ServiceLocator)
            .addArgument(new Reference('service_container'))
        ;

        return container;
    }

    /**
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Object.<*, *>} mapping
     * @param {string | Function} message
     * @param {string[] | Function[]} handlerClasses
     * @param {Object.<string, *>[]} options
     */
    assertHandlerDescriptor(container, mapping, message, handlerClasses, options = []) {
        message = ReflectionClass.getClassName(message);
        handlerClasses = handlerClasses.map(v => isArray(v) ? [ (isString(v[0]) ? v[0] : ReflectionClass.getClassName(v[0])), v[1] ] : (isString(v) ? v : ReflectionClass.getClassName(v)));

        __self.assertHasKey(message, mapping);
        __self.assertCount(handlerClasses.length, mapping[message].values);

        for (const [ index, klass ] of __jymfony.getEntries(handlerClasses)) {
            const handlerReference = mapping[message].values[index];

            let reference;
            if (isArray(klass)) {
                reference = [ new Reference(klass[0]), klass[1] ];
                options[index] = { method: klass[1], ...(options[index] || {}) };
            } else {
                reference = new Reference(klass);
            }

            const definitionArguments = container.getDefinition(handlerReference).getArguments();
            const methodDefinition = container.getDefinition(definitionArguments[0]);

            __self.assertEquals('getCallableFromArray', methodDefinition.getFactory());
            __self.assertEquals([ isArray(klass) ? reference : [ reference, '__invoke' ] ], methodDefinition.getArguments());
            __self.assertEquals(options[index] || {}, definitionArguments[1]);
        }
    }

    testItRegistersTheDebugCommand() {
        const commandBusId = 'command_bus', queryBusId = 'query_bus', emptyBus = 'empty_bus';
        const container = this.getContainerBuilder(commandBusId);
        container.register(queryBusId, MessageBusInterface).setArgument(0, []).addTag('messenger.bus');
        container.register(emptyBus, MessageBusInterface).setArgument(0, []).addTag('messenger.bus');
        container.register('messenger.middleware.handle_message', HandleMessageMiddleware)
            .addArgument(null)
            .setAbstract(true)
        ;

        container.register('console.command.messenger_debug', DebugCommand).addArgument([]);

        const middlewareHandlers = [ { id: 'handle_message' } ];

        container.setParameter(commandBusId + '.middleware', middlewareHandlers);
        container.setParameter(queryBusId + '.middleware', middlewareHandlers);

        container.register(DummyCommandHandler).addTag('messenger.message_handler', { bus: commandBusId });
        container.register(DummyQueryHandler).addTag('messenger.message_handler', { bus: queryBusId });
        container.register(MultipleBusesMessageHandler)
            .addTag('messenger.message_handler', { bus: commandBusId })
            .addTag('messenger.message_handler', { bus: queryBusId })
        ;

        (new ResolveClassPass()).process(container);
        (new MessengerPass()).process(container);

        __self.assertEquals({
            [commandBusId]: {
                [ReflectionClass.getClassName(DummyCommand)]: [ [ ReflectionClass.getClassName(DummyCommandHandler), {} ] ],
                [ReflectionClass.getClassName(MultipleBusesMessage)]: [ [ ReflectionClass.getClassName(MultipleBusesMessageHandler), {} ] ],
            },
            [queryBusId]: {
                [ReflectionClass.getClassName(DummyQuery)]: [ [ ReflectionClass.getClassName(DummyQueryHandler), {} ] ],
                [ReflectionClass.getClassName(MultipleBusesMessage)]: [ [ ReflectionClass.getClassName(MultipleBusesMessageHandler), {} ] ],
            },
            [emptyBus]: {},
        }, container.getDefinition('console.command.messenger_debug').getArgument(0));
    }

    // testRegistersTraceableBusesToCollector() {
    //     const fooBusId = 'messenger.bus.foo';
    //     const container = this.getContainerBuilder(fooBusId);
    //     container.register('data_collector.messenger', MessengerDataCollector);
    //     container.setParameter('kernel.debug', true);
    //
    //     (new MessengerPass()).process(container);
    //
    //     const debuggedFooBusId = 'debug.traced.' + fooBusId;
    //     __self.assertTrue(container.hasDefinition(debuggedFooBusId));
    //     __self.assertSame([ fooBusId, null, 0 ], container.getDefinition(debuggedFooBusId).getDecoratedService());
    //     __self.assertEquals([ [ 'registerBus', [ fooBusId, new Reference(debuggedFooBusId) ] ] ], container.getDefinition('data_collector.messenger').getMethodCalls());
    // }

    testFailedCommandsRegisteredWithServiceLocatorArgumentReplaced() {
        const globalReceiverName = 'global_failure_transport';
        const messageBusId = 'message_bus';
        const container = this.getContainerBuilder(messageBusId);

        container.register('console.command.messenger_failed_messages_retry', FailedMessagesRetryCommand)
            .setArgument(0, globalReceiverName)
            .setArgument(1, null)
            .setArgument(2, new Reference(messageBusId));
        container.register('console.command.messenger_failed_messages_show', FailedMessagesShowCommand)
            .setArgument(0, globalReceiverName)
            .setArgument(1, null);
        container.register('console.command.messenger_failed_messages_remove', FailedMessagesRetryCommand)
            .setArgument(0, globalReceiverName)
            .setArgument(1, null);

        (new MessengerPass()).process(container);

        const retryDefinition = container.getDefinition('console.command.messenger_failed_messages_retry');
        __self.assertNotNull(retryDefinition.getArgument(1));

        const showDefinition = container.getDefinition('console.command.messenger_failed_messages_show');
        __self.assertNotNull(showDefinition.getArgument(1));

        const removeDefinition = container.getDefinition('console.command.messenger_failed_messages_remove');
        __self.assertNotNull(removeDefinition.getArgument(1));
    }
}
