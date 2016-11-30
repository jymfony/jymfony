/** @global Jymfony */
const Event = Jymfony.EventDispatcher.Event;

class EventDispatcher
{
    constructor() {
        this.listeners = {};
        this.sorted = {};
    }

    dispatch(eventName, event = new Event) {
        for(let listener of this.getListeners(eventName)) {
            if (event.isPropagationStopped()) {
                break;
            }

            listener.apply(null, [event, eventName, this]);
        }

        return event;
    }

    * getListeners(eventName = null) {
        if (eventName) {
            if (! this.listeners[eventName]) {
                return [];
            }

            if (! this.sorted[eventName]) {
                this._sortListeners(eventName);
            }

            for(let listener of this.sorted[eventName]) {
                yield listener.listener;
            }

            return;
        }

        for (let eventName of Object.keys(this.listeners)) {
            yield* this.getListeners(eventName);
        }
    }

    addListener(eventName, listener, priority = 0) {
        if (isCallableArray(listener)) {
            listener = getCallableFromArray(listener);
        }

        if (typeof listener !== 'function') {
            throw new TypeError("Listener must be a function");
        }

        let listeners = this.listeners[eventName];
        if (undefined === listeners) {
            listeners = this.listeners[eventName] = [];
        }

        listeners.push({ listener: listener, priority: priority });
        delete this.sorted[eventName];
    }

    hasListeners(eventName) {
        return (!! this.listeners[eventName]) && this.listeners[eventName].length > 0;
    }

    removeListener(eventName, listener) {
        if (! this.listeners[eventName]) {
            return;
        }

        if (isCallableArray(listener)) {
            listener = getCallableFromArray(listener);
        }

        for (let registered of this.listeners[eventName]) {
            if (! EventDispatcher._funcEquals(registered.listener, listener)) {
                continue;
            }

            let index = this.listeners[eventName].indexOf(registered);
            this.listeners[eventName].splice(index, 1);
        }
    }

    addSubscriber(subscriber) {
        let events = __jymfony.getFunction(subscriber, 'getSubscribedEvents')();
        for (let eventName in events) {
            if (! events.hasOwnProperty(eventName)) {
                continue;
            }

            let params = events[eventName];
            if (isString(params)) {
                this.addListener(eventName, [subscriber, params]);
            } else if (isString(params[0])) {
                this.addListener(eventName, [subscriber, params[0]], params[1] || 0);
            } else {
                for (let listener of params) {
                    this.addListener(eventName, [subscriber, listener[0]], listener[1] || 0);
                }
            }
        }
    }

    removeSubscriber(subscriber) {
        let events = __jymfony.getFunction(subscriber, 'getSubscribedEvents')();
        for (let eventName in events) {
            if (! events.hasOwnProperty(eventName)) {
                continue;
            }

            let params = events[eventName];
            if (isArray(params) && isArray(params[0])) {
                for(let listener of params) {
                    this.removeListener(eventName, [subscriber, listener[0]]);
                }
            } else {
                this.removeListener(eventName, [subscriber, isString(params) ? params : params[0]]);
            }
        }
    }

    _sortListeners(eventName) {
        if (undefined === this.listeners[eventName]) {
            return;
        }

        // Clone the array
        let listeners = this.listeners[eventName].slice(0);
        this.sorted[eventName] = listeners.sort((a, b) => {
            return b.priority - a.priority;
        });
    }

    static _funcEquals(func1, func2) {
        if (func1.innerObject) {
            func1 = func1.innerObject;
        }

        if (func2.innerObject) {
            func2 = func2.innerObject;
        }

        if (func1.constructor.name !== func2.constructor.name) {
            return false;
        }

        if (func1 instanceof BoundFunction) {
            return func1.equals(func2);
        }

        return func1 === func2;
    }
}

module.exports = EventDispatcher;
