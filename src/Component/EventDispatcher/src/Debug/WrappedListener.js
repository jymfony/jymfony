/**
 * @memberOf Jymfony.Component.EventDispatcher.Debug
 */
class WrappedListener {
    __construct(listener, dispatcher) {
        this._listener = listener;
        this._dispacther = dispatcher;
        this._called = false;
        this._stoppedPropagation = false;

        if (isCallableArray(listener)) {
            this._name = (new ReflectionClass(listener[0])).name;
            this._pretty = this._name + '.' + listener[1];
        } else {
            this._name = this._pretty = 'Function';
        }

        return new Proxy(listener, {
            get: (target, key) => {
                if (Reflect.has(this, key)) {
                    return Reflect.get(this, key);
                }

                return Reflect.get(target, key);
            },
            has: (target, key) => {
                return Reflect.has(this, key) || Reflect.get(target, key);
            },
            apply: (target, thisArg, argArray) => {
                const [ event, eventName ] = argArray;
                this._called = true;

                Reflect.apply(target, thisArg, [ event, eventName, this._dispacther ]);

                if (event.isPropagationStopped()) {
                    this._stoppedPropagation = true;
                }
            },
        });
    }

    get wrappedListener() {
        return this._listener;
    }

    get wasCalled() {
        return this._called;
    }

    get stoppedPropagation() {
        return this._stoppedPropagation;
    }

    get pretty() {
        return this._pretty;
    }
}

module.exports = WrappedListener;
