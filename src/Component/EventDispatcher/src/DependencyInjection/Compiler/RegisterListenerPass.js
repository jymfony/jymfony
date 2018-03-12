const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const EventSubscriberInterface = Jymfony.Component.EventDispatcher.EventSubscriberInterface;
const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const ServiceClosureArgument = Jymfony.Component.DependencyInjection.Argument.ServiceClosureArgument;
const NotStaticMethodException = Jymfony.Component.EventDispatcher.Exception.NotStaticMethodException;

/**
 * @memberOf Jymfony.Component.EventDispatcher.DependencyInjection.Compiler
 */
class RegisterListenerPass extends implementationOf(CompilerPassInterface) {
    __construct(dispatcherService = 'event_dispatcher', listenerTag = 'kernel.event_listener', subscriberTag = 'kernel.event_subscriber') {
        this.dispatcherService = dispatcherService;
        this.listenerTag = listenerTag;
        this.subscriberTag = subscriberTag;
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    process(container) {
        if (! container.hasDefinition(this.dispatcherService) && !container.hasAlias(this.dispatcherService)) {
            return;
        }

        const definition = container.findDefinition(this.dispatcherService);

        for (const [ id, events ] of __jymfony.getEntries(container.findTaggedServiceIds(this.listenerTag))) {
            for (const event of events) {
                const priority = event.priority !== undefined ? event.priority : 0;

                if (event.event === undefined) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Service "%s" must define the "event" attribute on "%s" tags.', id, this.listenerTag));
                }

                if (event.method === undefined) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Service "%s" must define the "method" attribute on "%s" tags.', id, this.listenerTag));
                }

                definition.addMethodCall('addListenerService', [
                    event.event,
                    [
                        id,
                        event.method,
                        priority,
                    ],
                ]);
            }
        }

        const extractingDispatcher = new ExtractingEventDispatcher();

        for (const [ id ] of __jymfony.getEntries(container.findTaggedServiceIds(this.subscriberTag))) {
            const def = container.getDefinition(id);

            const myclass = container.parameterBag.resolveValue(def.getClass());
            let myReflectionClass;
            try {
                myReflectionClass = new ReflectionClass(myclass);
            } catch (err) {
                if (err instanceof ReflectionException) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Service "%s" requires a non-existent class "%s".', id, myclass));
                }

                throw err;
            }

            if (! myReflectionClass.isSubclassOf(EventSubscriberInterface)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Service "%s" must implement interface "Jymfony.Component.EventDispatcher.EventSubscriberInterface".', id));
            }

            container.addObjectResource(myclass);
            extractingDispatcher.subscriber = myclass;

            try {
                for (const args of extractingDispatcher.listeners) {
                    args[1] = [ new ServiceClosureArgument(new Reference(id)), args[1] ];
                    definition.addMethodCall('addListener', args);
                }
            } catch (e) {
                if (e instanceof NotStaticMethodException) {
                    definition.addMethodCall('addSubscriber', [ new Reference(id) ]);
                } else {
                    throw e;
                }
            }
        }
    }
}

class ExtractingEventDispatcher extends mix(EventDispatcher, EventSubscriberInterface) {
    __construct() {
        super.__construct();
        this._listeners = [];
    }

    set subscriber(subscriber) {
        this._listeners = [];

        this._subscriber = subscriber;
        this.addSubscriber(this);
    }

    get listeners() {
        return this._listeners;
    }

    addListener(eventName, listener, priority = 0) {
        this._listeners.push([ eventName, listener[1], priority ]);
    }

    getSubscribedEvents() {
        const reflClass = new ReflectionClass(this._subscriber);
        const class_ = reflClass.getConstructor();

        if (! isFunction(class_.getSubscribedEvents)) {
            throw new NotStaticMethodException();
        }

        return class_.getSubscribedEvents();
    }
}

module.exports = RegisterListenerPass;
