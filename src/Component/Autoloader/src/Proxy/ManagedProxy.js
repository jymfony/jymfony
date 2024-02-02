try {
    require('@jymfony/util');
} catch (e) {
    require('../../../../util');
}

let capture = () => {};

/**
 * @memberOf Jymfony.Component.Autoloader.Proxy
 */
class ManagedProxy {
    /**
     * Constructor.
     *
     * @param {*} target
     * @param {Function} initializer
     * @param {*} traps
     */
    constructor(target, initializer = null, traps = {}) {
        this._target = null;
        this._initializer = initializer;
        capture.call(this, target);

        traps.get = traps.get || ((target, key) => Reflect.get(target, key));
        traps.set = traps.set || ((target, key, value) => Reflect.set(target, key, value));
        traps.has = traps.has || ((target, key) => Reflect.has(target, key));
        traps.deleteProperty = traps.deleteProperty || ((target, key) => Reflect.deleteProperty(target, key));
        traps.defineProperty = traps.defineProperty || ((target, key, descriptor) => Reflect.defineProperty(target, key, descriptor));
        traps.enumerate = traps.enumerate || ((target) => Reflect.enumerate(target));
        traps.ownKeys = traps.ownKeys || ((target) => Reflect.ownKeys(target));
        traps.apply = traps.apply || ((target, thisArgument, args) => Reflect.apply(target, thisArgument, args));
        traps.construct = traps.construct || ((target, argumentsList, newTarget) => Reflect.construct(target, argumentsList, newTarget));
        traps.getPrototypeOf = traps.getPrototypeOf || ((target) => Reflect.getPrototypeOf(target));
        traps.setPrototypeOf = traps.setPrototypeOf || ((target, proto) => Reflect.setPrototypeOf(target, proto));
        traps.isExtensible = traps.isExtensible || ((target) => Reflect.isExtensible(target));
        traps.preventExtensions = traps.preventExtensions || ((target) => Reflect.preventExtensions(target));
        traps.getOwnPropertyDescriptor = traps.getOwnPropertyDescriptor || ((target, key) => Reflect.getOwnPropertyDescriptor(target, key));

        const handlers = {
            get: (target, key) => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.get(this._target, key);
            },
            set: (target, key, value) => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.set(this._target, key, value);
            },
            has: (target, key) => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.has(this._target, key);
            },
            deleteProperty: (target, key) => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.deleteProperty(this._target, key);
            },
            defineProperty: (target, key, descriptor) => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.defineProperty(this._target, key, descriptor);
            },
            enumerate: () => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.enumerate(this._target);
            },
            ownKeys: () => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.ownKeys(this._target);
            },
            apply: (target, thisArgument, args) => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.apply(this._target, thisArgument, args);
            },
            construct: (target, argumentsList, newTarget) => {
                this._initializer = this._initializer && this._initializer(this);

                try {
                    newTarget = newTarget.prototype && newTarget.prototype instanceof this._target ? newTarget : this._target;
                } catch (e) {
                    newTarget = this._target;
                }

                return traps.construct(this._target, argumentsList, newTarget);
            },
            getPrototypeOf: () => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.getPrototypeOf(this._target);
            },
            setPrototypeOf: (target, proto) => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.setPrototypeOf(this._target, proto);
            },
            isExtensible: () => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.isExtensible(this._target);
            },
            preventExtensions: () => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.preventExtensions(this._target);
            },
            getOwnPropertyDescriptor: (target, key) => {
                this._initializer = this._initializer && this._initializer(this);

                return traps.getOwnPropertyDescriptor(this._target, key);
            },
        };

        return new Proxy(target, handlers);
    }

    /**
     * Sets the target (during initialization).
     *
     * @param {*} target
     */
    set target(target) {
        this._target = target;
    }

    /**
     * Sets the initializer.
     *
     * @param {Function} initializer
     */
    set initializer(initializer) {
        this._initializer = initializer;
    }

    /**
     * Enables debug of proxies.
     */
    static enableDebug() {
        capture = function (target) {
            this._traceError = new Error();
            this._initialTarget = target;
        };
    }

    /**
     * Gets proxy debug info.
     *
     * @returns {Object.<string, *>}
     */
    get debugInfo() {
        if (! this._trace && this._traceError) {
            this._trace = Exception.parseStackTrace(this._traceError).slice(2);
        }

        return {
            trace: this._trace,
            target: this._initialTarget,
        };
    }
}

if (process.env.DEBUG || globalThis.__jymfony.debug) {
    ManagedProxy.enableDebug();
}

module.exports = __jymfony.ManagedProxy = ManagedProxy;
