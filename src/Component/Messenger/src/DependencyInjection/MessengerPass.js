const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const HandlerDescriptor = Jymfony.Component.Messenger.Handler.HandlerDescriptor;
const HandlersLocator = Jymfony.Component.Messenger.Handler.HandlersLocator;
const IteratorArgument = Jymfony.Component.DependencyInjection.Argument.IteratorArgument;
const MessageSubscriberInterface = Jymfony.Component.Messenger.Handler.MessageSubscriberInterface;
const ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const ReflectionHelper = Jymfony.Component.Autoloader.Reflection.ReflectionHelper;
const ServiceLocatorTagPass = Jymfony.Component.DependencyInjection.Compiler.ServiceLocatorTagPass;
const TraceableMessageBus = Jymfony.Component.Messenger.TraceableMessageBus;

/**
 * @memberOf Jymfony.Component.Messenger.DependencyInjection
 */
export default class MessengerPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        const busIds = [];
        for (const [ busId ] of __jymfony.getEntries(container.findTaggedServiceIds('messenger.bus'))) {
            busIds.push(busId);

            const busMiddlewareParameter = busId + '.middleware';
            if (container.hasParameter(busMiddlewareParameter)) {
                this._registerBusMiddleware(container, busId, container.getParameter(busMiddlewareParameter));

                container.parameterBag.remove(busMiddlewareParameter);
            }

            if (container.hasDefinition('data_collector.messenger')) {
                this._registerBusToCollector(container, busId);
            }
        }

        if (container.hasDefinition('messenger.receiver_locator')) {
            this._registerReceivers(container, busIds);
        }

        this._registerHandlers(container, busIds);
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {string[]} busIds
     *
     * @private
     */
    _registerHandlers(container, busIds) {
        const definitions = {};
        const handlersByBusAndMessage = {};
        const handlerToOriginalServiceIdMapping = {};

        for (const [ serviceId, tags ] of __jymfony.getEntries(container.findTaggedServiceIds('messenger.message_handler', true))) {
            for (const tag of tags) {
                if (!!tag.bus && !busIds.includes(tag.bus)) {
                    throw new RuntimeException(__jymfony.sprintf('Invalid handler service "%s": bus "%s" specified on the tag "messenger.message_handler" does not exist (known ones are: "%s").', serviceId, tag.bus, busIds.join('", "')));
                }

                const className = this._getServiceClass(container, serviceId);
                const r = container.getReflectionClass(className);

                if (null === r) {
                    throw new RuntimeException(__jymfony.sprintf('Invalid service "%s": class "%s" does not exist.', serviceId, className));
                }

                let handles;
                if (tag.handles) {
                    handles = tag.method ? { [tag.handles]: tag.method } : [ tag['handles'] ];
                } else {
                    handles = this._guessHandledClasses(r, serviceId);
                }

                const message = null;
                const handlerBuses = tag.bus ? (isArray(tag.bus) ? tag.bus : [ tag.bus ]) : busIds;

                for (let [ message, options ] of __jymfony.getEntries(handles)) {
                    let buses = handlerBuses;
                    if (isNumeric(message)) {
                        if (isString(options)) {
                            message = options;
                            options = {};
                        } else {
                            throw new RuntimeException(__jymfony.sprintf('The handler configuration needs to return an array of messages or an associated array of message and configuration. Found value of type "%s" at position "%d" for service "%s".', __jymfony.get_debug_type(options), message, serviceId));
                        }
                    }

                    if (isString(options)) {
                        options = { method: options };
                    }

                    if (!! options.from_transport && !! tag.from_transport) {
                        options.from_transport = tag.from_transport;
                    }

                    const priority = tag.priority || options.priority || 0;
                    const method = options.method || '__invoke';

                    if (options.bus) {
                        if (!busIds.includes(options.bus)) {
                            const messageLocation = tag.handles ? 'declared in your tag attribute "handles"' : (r.isInstanceOf(MessageSubscriberInterface) ? __jymfony.sprintf('returned by method "%s.getHandledMessages()"', r.name) : __jymfony.sprintf('used as argument type in method "%s.%s()"', r.name, method));

                            throw new RuntimeException(__jymfony.sprintf('Invalid configuration "%s" for message "%s": bus "%s" does not exist.', messageLocation, message, options.bus));
                        }

                        buses = [ options['bus'] ];
                    }

                    if ('*' !== message && !ReflectionClass.exists(message)) {
                        const messageLocation = tag.handles ? 'declared in your tag attribute "handles"' : (r.isInstanceOf(MessageSubscriberInterface) ? __jymfony.sprintf('returned by method "%s.getHandledMessages()"', r.name) : __jymfony.sprintf('used as argument type in method "%s.%s()"', r.name, method));

                        throw new RuntimeException(__jymfony.sprintf('Invalid handler service "%s": class or interface "%s" "%s" not found.', serviceId, message, messageLocation));
                    }

                    if (!r.hasMethod(method)) {
                        throw new RuntimeException(__jymfony.sprintf('Invalid handler service "%s": method "%s.%s()" does not exist.', serviceId, r.name, method));
                    }

                    let definitionId;
                    if ('__invoke' !== method) {
                        const wrapperDefinition = (new Definition('BoundFunction')).addArgument([ new Reference(serviceId), method ]).setFactory('getCallableFromArray');

                        definitionId = '.messenger.method_on_object_wrapper.' + ContainerBuilder.hash(message + ':' + priority + ':' + serviceId + ':' + method);
                        definitions[definitionId] = wrapperDefinition;
                    } else {
                        definitionId = serviceId;
                    }

                    handlerToOriginalServiceIdMapping[definitionId] = serviceId;

                    for (const handlerBus of buses) {
                        handlersByBusAndMessage[handlerBus] = handlersByBusAndMessage[handlerBus] || {};
                        handlersByBusAndMessage[handlerBus][message] = handlersByBusAndMessage[handlerBus][message] || {};
                        handlersByBusAndMessage[handlerBus][message][priority] = handlersByBusAndMessage[handlerBus][message][priority] || [];
                        handlersByBusAndMessage[handlerBus][message][priority].push([ definitionId, options ]);
                    }
                }

                if (null === message) {
                    throw new RuntimeException(__jymfony.sprintf('Invalid handler service "%s": method "%s.getHandledMessages()" must return one or more messages.', serviceId, r.name));
                }
            }
        }

        for (const [ bus, handlersByMessage ] of __jymfony.getEntries(handlersByBusAndMessage)) {
            for (const [ message, handlersByPriority ] of __jymfony.getEntries(handlersByMessage)) {
                handlersByBusAndMessage[bus][message] = [ ...Object.values(Object.ksort(handlersByPriority)) ];
            }
        }

        const handlersLocatorMappingByBus = {};
        for (const [ bus, handlersByMessage ] of __jymfony.getEntries(handlersByBusAndMessage)) {
            for (const [ message, handlers ] of __jymfony.getEntries(handlersByMessage)) {
                const handlerDescriptors = [];
                for (const handler of handlers) {
                    const definitionId = '.messenger.handler_descriptor.' + ContainerBuilder.hash(bus + ':' + message + ':' + handler[0]);
                    definitions[definitionId] = (new Definition(HandlerDescriptor)).setArguments([ new Reference(handler[0]), handler[1] ]);
                    handlerDescriptors.push(new Reference(definitionId));
                }

                handlersLocatorMappingByBus[bus][message] = new IteratorArgument(handlerDescriptors);
            }
        }

        container.addDefinitions(definitions);

        for (const bus of busIds) {
            const locatorId = bus + '.messenger.handlers_locator';
            container.register(locatorId, HandlersLocator)
                .setArguments([ handlersLocatorMappingByBus[bus] || [] ]);

            const handleMessageId = bus + '.middleware.handle_message';
            if (container.has(handleMessageId)) {
                container.getDefinition(handleMessageId)
                    .replaceArgument(0, new Reference(locatorId))
                ;
            }
        }

        if (container.hasDefinition('console.command.messenger_debug')) {
            const debugCommandMapping = handlersByBusAndMessage;
            for (const bus of busIds) {
                if (!debugCommandMapping[bus]) {
                    debugCommandMapping[bus] = {};
                }

                for (const [ message, handlers ] of __jymfony.getEntries(debugCommandMapping[bus])) {
                    for (const [ key, handler ] of __jymfony.getEntries(handlers)) {
                        debugCommandMapping[bus][message] = debugCommandMapping[bus][message] || {};
                        debugCommandMapping[bus][message][key] = debugCommandMapping[bus][message][key] || [];
                        debugCommandMapping[bus][message][key][0] = handlerToOriginalServiceIdMapping[handler[0]];
                    }
                }
            }

            container.getDefinition('console.command.messenger_debug').replaceArgument(0, debugCommandMapping);
        }
    }

    /**
     *
     * @param {ReflectionClass} handlerClass
     * @param {string} serviceId
     *
     * @private
     */
    _guessHandledClasses(handlerClass, serviceId) {
        if (handlerClass.isInstanceOf(MessageSubscriberInterface)) {
            return handlerClass.getMethod('getHandledMessages').invoke(null);
        }

        const method = (() => {
            try {
                return handlerClass.getMethod('__invoke');
            } catch (e) {
                throw new RuntimeException(__jymfony.sprintf('Invalid handler service "%s": class "%s" must have an "__invoke()" method.', serviceId, handlerClass.name));
            }
        })();

        if (0 === method.parameters.length) {
            throw new RuntimeException(__jymfony.sprintf('Invalid handler service "%s": method "%s.__invoke()" requires at least one argument, first one being the message it handles.', serviceId, handlerClass.name));
        }

        const parameters = method.parameters;
        const type = ReflectionHelper.getParameterType(parameters[0]);
        if (! type || ! ReflectionClass.exists(type)) {
            throw new RuntimeException(__jymfony.sprintf('Invalid handler service "%s": argument "%s" of method "%s.__invoke()" must have a type decorator corresponding to the message class it handles.', serviceId, parameters[0].name, handlerClass.name));
        }

        return [ ReflectionClass.getClassName(type) ];
    }

    _registerReceivers(container, busIds) {
        const receiverMapping = {};
        const failureTransportsMap = {};
        if (container.hasDefinition('console.command.messenger_failed_messages_retry')) {
            const commandDefinition = container.getDefinition('console.command.messenger_failed_messages_retry');
            const globalReceiverName = commandDefinition.getArgument(0);
            if (null !== globalReceiverName) {
                if (container.hasAlias('messenger.failure_transports.default')) {
                    failureTransportsMap[globalReceiverName] = new Reference('messenger.failure_transports.default');
                } else {
                    failureTransportsMap[globalReceiverName] = new Reference('messenger.transport.'.globalReceiverName);
                }
            }
        }

        for (const [ id, tags ] of __jymfony.getEntries(container.findTaggedServiceIds('messenger.receiver'))) {
            const receiverClass = this._getServiceClass(container, id);
            if (!(new ReflectionClass(receiverClass)).isSubclassOf(ReceiverInterface)) {
                throw new RuntimeException(__jymfony.sprintf('Invalid receiver "%s": class "%s" must implement interface "%s".', id, receiverClass, ReflectionClass.getClassName(ReceiverInterface)));
            }

            receiverMapping[id] = new Reference(id);

            for (const tag of tags) {
                if (!!tag.alias) {
                    receiverMapping[tag.alias] = receiverMapping[id];
                    if (tag.is_failure_transport || false) {
                        failureTransportsMap[tag.alias] = receiverMapping[id];
                    }
                }
            }
        }

        const receiverNames = {};
        for (const [ name, reference ] of __jymfony.getEntries(receiverMapping)) {
            receiverNames[String(reference)] = name;
        }

        const buses = {};
        for (const busId of busIds) {
            buses[busId] = new Reference(busId);
        }

        const hasRoutableMessageBus = container.hasDefinition('messenger.routable_message_bus');
        if (hasRoutableMessageBus) {
            container.getDefinition('messenger.routable_message_bus')
                .replaceArgument(0, ServiceLocatorTagPass.register(container, buses));
        }

        if (container.hasDefinition('console.command.messenger_consume_messages')) {
            const consumeCommandDefinition = container.getDefinition('console.command.messenger_consume_messages');

            if (hasRoutableMessageBus) {
                consumeCommandDefinition.replaceArgument(0, new Reference('messenger.routable_message_bus'));
            }

            consumeCommandDefinition.replaceArgument(4, Object.values(receiverNames));
            consumeCommandDefinition.replaceArgument(5, busIds);
        }

        if (container.hasDefinition('console.command.messenger_setup_transports')) {
            container.getDefinition('console.command.messenger_setup_transports')
                .replaceArgument(1, Object.values(receiverNames));
        }

        container.getDefinition('messenger.receiver_locator').replaceArgument(0, receiverMapping);

        const failureTransportsLocator = ServiceLocatorTagPass.register(container, failureTransportsMap);

        const failedCommandIds = [
            'console.command.messenger_failed_messages_retry',
            'console.command.messenger_failed_messages_show',
            'console.command.messenger_failed_messages_remove',
        ];

        for (const failedCommandId of failedCommandIds) {
            if (container.hasDefinition(failedCommandId)) {
                const definition = container.getDefinition(failedCommandId);
                definition.replaceArgument(1, failureTransportsLocator);
            }
        }
    }

    _registerBusToCollector(container, busId) {
        const tracedBusId = 'debug.traced.' + busId;
        container.setDefinition(
            tracedBusId,
            (new Definition(TraceableMessageBus, [ new Reference(tracedBusId + '.inner') ])).setDecoratedService(busId)
        );

        container.getDefinition('data_collector.messenger').addMethodCall('registerBus', [ busId, new Reference(tracedBusId) ]);
    }

    _registerBusMiddleware(container, busId, middlewareCollection) {
        const middlewareReferences = {};
        for (const middlewareItem of middlewareCollection) {
            const id = middlewareItem.id;
            const args = middlewareItem.arguments || [];

            let messengerMiddlewareId = 'messenger.middleware.' + id;
            if (!container.has(messengerMiddlewareId)) {
                messengerMiddlewareId = id;
            }

            if (!container.has(messengerMiddlewareId)) {
                throw new RuntimeException(__jymfony.sprintf('Invalid middleware: service "%s" not found.', id));
            }

            if (container.findDefinition(messengerMiddlewareId).isAbstract()) {
                const childDefinition = new ChildDefinition(messengerMiddlewareId);
                childDefinition.setArguments(args);
                if (undefined !== middlewareReferences[messengerMiddlewareId = busId + '.middleware.' + id]) {
                    messengerMiddlewareId += '.' + ContainerBuilder.hash(args);
                }

                container.setDefinition(messengerMiddlewareId, childDefinition);
            } else if (args) {
                throw new RuntimeException(__jymfony.sprintf('Invalid middleware factory "%s": a middleware factory must be an abstract definition.', id));
            }

            middlewareReferences[messengerMiddlewareId] = new Reference(messengerMiddlewareId);
        }

        container.getDefinition(busId).replaceArgument(0, new IteratorArgument(Object.values(middlewareReferences)));
    }

    _getServiceClass(container, serviceId) {
        while (true) {
            const definition = container.findDefinition(serviceId);

            if (!definition.getClass() && definition instanceof ChildDefinition) {
                serviceId = definition.getParent();

                continue;
            }

            return definition.getClass();
        }
    }
}
