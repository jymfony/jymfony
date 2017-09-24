const ArgumentsWildcard = Jymfony.Component.Testing.Argument.ArgumentsWildcard;
const CallCenter = Jymfony.Component.Testing.Call.CallCenter;
const Doubler = Jymfony.Component.Testing.Double.Doubler;
const MethodProphecyException = Jymfony.Component.Testing.Exception.MethodProphecyException;
const AggregateException = Jymfony.Component.Testing.Exception.Prediction.AggregateException;
const PredictionException = Jymfony.Component.Testing.Exception.Prediction.PredictionException;
const ProphecyInterface = Jymfony.Component.Testing.Prophecy.ProphecyInterface;
const MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;
const Revealer = Jymfony.Component.Testing.Prophecy.Revealer;

/**
 * @memberOf Jymfony.Component.Testing.Prophecy
 */
class ObjectProphecy extends implementationOf(ProphecyInterface) {
    /**
     * Constructor.
     */
    __construct(doubler = undefined, revealer = undefined, callCenter = undefined) {
        /**
         * @type {Jymfony.Component.Testing.Double.Doubler}
         * @private
         */
        this._doubler = doubler || new Doubler(this);

        /**
         * @type {Jymfony.Component.Testing.Prophecy.Revealer}
         * @private
         */
        this._revealer = revealer || new Revealer();

        /**
         * @type {Jymfony.Component.Testing.Call.CallCenter}
         * @private
         */
        this._callCenter = callCenter || new CallCenter();

        this._methodProphecies = {};

        return new Proxy(this, {
            get: (target, key) => {
                if (Reflect.has(this, key)) {
                    return Reflect.get(target, key);
                }

                const reflection = new ReflectionClass(this.reveal());
                if (! reflection.hasMethod(key) && ! reflection.hasProperty(key)) {
                    return Reflect.get(this.reveal(), key);
                }

                const prophecies = this.getMethodProphecies(key);

                const method = new MethodProphecy(this, key);
                return new Proxy(() => {}, {
                    get: (target, key) => {
                        return Reflect.get(method, key);
                    },
                    has: (target, key) => {
                        return Reflect.has(method, key);
                    },
                    apply: (target, thisArgument, args) => {
                        args = new ArgumentsWildcard(this._revealer.reveal(args));
                        for (const candidate of prophecies) {
                            if (__jymfony.equal(candidate.argumentsWildcard, args)) {
                                return candidate;
                            }
                        }

                        return method.withArguments(args);
                    },
                });
            },
            set: (target, key, value) => {
                return this.reveal()[key] = value;
            },
        });
    }

    /**
     * Gets the registered method prophecies.
     *
     * @returns {Object<string, [Jymfony.Component.Testing.Prophecy.MethodProphecy]>}
     */
    get methodProphecies() {
        return this._methodProphecies;
    }

    /**
     * Gets the prophecy revealer.
     *
     * @returns {Jymfony.Component.Testing.Prophecy.Revealer}
     */
    get revealer() {
        return this._revealer;
    }

    /**
     * Forces double to implement specific interface.
     *
     * @param {Function} Interface
     *
     * @returns {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
     */
    willImplement(Interface) {
        this._doubler.addInterface(Interface);

        return this;
    }

    /**
     * Forces double to extend specific class.
     *
     * @param {Function} Class
     *
     * @returns {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
     */
    willExtend(Class) {
        this._doubler.superClass = Class;

        return this;
    }

    /**
     * Sets constructor arguments.
     *
     * @param {[*]} args
     *
     * @returns {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
     */
    willBeConstructedWith(args) {
        this._doubler.constructorArguments = args;

        return this;
    }

    /**
     * Finds calls by method name & arguments wildcard.
     *
     * @param {string} methodName
     * @param {Jymfony.Component.Testing.Argument.ArgumentsWildcard} wildcard
     *
     * @returns {[Jymfony.Component.Testing.Call.Call]}
     */
    findProphecyMethodCalls(methodName, wildcard) {
        return this._callCenter.findCalls(methodName, wildcard);
    }

    /**
     * Makes specific method call.
     *
     * @param {string} methodName
     * @param {[*]} args
     *
     * @returns {*}
     */
    makeProphecyMethodCall(methodName, args) {
        return this._revealer.reveal(this._callCenter.makeCall(
            this,
            methodName,
            this._revealer.reveal(args)
        ));
    }

    /**
     * Register a method prophecy.
     *
     * @param {Jymfony.Component.Testing.Prophecy.MethodProphecy} methodProphecy
     *
     * @returns {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
     */
    addMethodProphecy(methodProphecy) {
        const methodName = methodProphecy.methodName;
        const argumentsWildcard = methodProphecy.argumentsWildcard;
        if (undefined === argumentsWildcard) {
            throw new MethodProphecyException(__jymfony.sprintf(
                'Can not add prophecy for method `%s`\n' +
                'as you did not specify arguments wildcard for it.',
                methodName
            ), methodProphecy);
        }

        if (undefined === this._methodProphecies[methodName]) {
            this._methodProphecies[methodName] = [];
        }

        if (-1 === this._methodProphecies[methodName].indexOf(methodProphecy)) {
            this._methodProphecies[methodName].push(methodProphecy);
        }

        return this;
    }

    /**
     * Returns either all or related to single method prophecies.
     *
     * @param {undefined|string} methodName
     *
     * @returns {[Jymfony.Component.Testing.Prophecy.MethodProphecy]}
     */
    getMethodProphecies(methodName = undefined) {
        if (undefined === methodName) {
            const self = this;
            return Array.from((function * () {
                for (const k of Object.keys(self._methodProphecies)) {
                    yield * self._methodProphecies[k];
                }
            })());
        }

        if (undefined === this._methodProphecies[methodName]) {
            return [];
        }

        return this._methodProphecies[methodName];
    }

    /**
     * Checks that registered method predictions do not fail.
     *
     * @throws {Jymfony.Component.Testing.Exception.Prediction.AggregateException} If any of registered predictions fail
     */
    checkProphecyMethodsPredictions() {
        let exception;
        for (const prophecies of Object.values(this._methodProphecies)) {
            for (const prophecy of prophecies) {
                try {
                    prophecy.checkPrediction();
                } catch (e) {
                    if (! (e instanceof PredictionException)) {
                        throw e;
                    }

                    if (undefined === exception) {
                        exception = new AggregateException((new ReflectionClass(this)).name + ':\n');
                        exception.objectProphecy = this;
                    }

                    exception.append(e);
                }
            }
        }

        if (exception) {
            throw exception;
        }
    }

    /**
     * @inheritDoc
     */
    reveal() {
        return this._doubler.getInstance();
    }
}

module.exports = ObjectProphecy;
