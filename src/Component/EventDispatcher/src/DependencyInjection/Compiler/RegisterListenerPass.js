const CompilerPassInterface = Jymfony.Component.DependencyInjection.CompilerPassInterface;
const EventSubscriberInterface = Jymfony.EventDispatcher.EventSubscriberInterface;
const EventDispatcher = Jymfony.EventDispatcher.EventDispatcher;
const ServiceClosureArgument = Jymfony.Component.DependencyInjection.Argument.ServiceClousureArgument;
const NotStaticMethodException = Jymfony.Component.DependencyInjection.Exception.NotStaticMethodException;

class RegisterListenerPass extends implementationOf(CompilerPassInterface) {
    __construct (dispatcherService = 'event_dispatcher', listenerTag = 'kernel.event_listener', subscriberTag = 'kernel.event_subscriber') {
        this.dispatcherService = dispatcherService;
        this.listenerTag = listenerTag;
        this.subscriberTag = subscriberTag;
    }

    /**
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    process(container) {
        if (! container.hasDefinition(this.dispatcherService) && !container.hasAlias(this.dispatcherService)) {
            return;
        }

        let definition = container.findDefinition(this.dispatcherService);

        for (let [ id, events ] of __jymfony.getEntries(container.findTaggedServiceIds(this.listenerTag))) {
            for (let event of events) {
                let priority = event.priority !== undefined ? event.priority : 0;

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

        let extractingDispatcher = new ExtractingEventDispatcher();

        for (let [ id, attributes ] of __jymfony.getEntries(container.findTaggedServiceIds(this.subscriberTag))) {
            let def = container.getDefinition(id);

            let myclass = container.getParameterBag().resolveValue(def.getClass());
            let myReflectionClass = new ReflectionClass(myclass);

            if (! myReflectionClass.isSubclassOf(EventSubscriberInterface)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Service "%s" must implement interface "Jymfony.EventDispatcher.EventSubscriberInterface".', id));
            }

            container.addObjectResource(myclass);
            extractingDispatcher.subscriber = myclass;

            try {
                for (let args of extractingDispatcher.listeners) {
                    args[1] = [ new ServiceClosureArgument(new Reference(id), args[1]) ];
                    definition.addMethodCall('addListener', args);
                }
            } catch (e) {
                if (e instanceof NotStaticMethodException) {
                    definition.addMethodCall('addSubscriber', [ new Reference(id) ]);
                }

                throw e;
            }
        }
    }
}

class ExtractingEventDispatcher extends mix(EventDispatcher, EventSubscriberInterface) {
    constructor() {
        super();

        this.__construct();
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
        let reflClass = new ReflectionClass(this._subscriber);
        let class_ = reflClass.getConstructor();

        if (! isFunction(class_.getSubscribedEvents)) {
            throw new NotStaticMethodException();
        }

        return class_.getSubscribedEvents();
    }
}

module.exports = RegisterListenerPass;
