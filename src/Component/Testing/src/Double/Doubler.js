const DoubleException = Jymfony.Component.Testing.Exception.DoubleException;
const ClassGenerator = Jymfony.Component.Testing.Double.ClassGenerator;

/**
 * @memberOf Jymfony.Component.Testing.Double
 */
export default class Doubler {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Testing.Prophecy.ObjectProphecy} prophecy
     */
    __construct(prophecy) {
        /**
         * @type {undefined|Function}
         *
         * @private
         */
        this._superClass = undefined;

        /**
         * @type {Function[]}
         *
         * @private
         */
        this._interfaces = [];

        /**
         * @type {undefined|Object}
         *
         * @private
         */
        this._instance = undefined;

        /**
         * @type {undefined|Array}
         *
         * @private
         */
        this._constructorArgs = undefined;

        /**
         * @type {Jymfony.Component.Testing.Prophecy.ObjectProphecy}
         *
         * @private
         */
        this._prophecy = prophecy;
    }

    /**
     * Adds an interface to be implemented by the double.
     *
     * @param {Function} interface_
     *
     * @returns {Jymfony.Component.Testing.Double.Doubler}
     */
    addInterface(interface_) {
        if (undefined !== this._instance) {
            throw new DoubleException('Can not implement interface with already instantiated double.');
        }

        if (-1 === this._interfaces.indexOf(interface_)) {
            this._interfaces.push(interface_);
        }

        return this;
    }

    /**
     * Sets the class to be extended by the double.
     *
     * @param {Function} class_
     */
    set superClass(class_) {
        if (undefined !== this._instance) {
            throw new DoubleException('Can not extend class with already instantiated double.');
        }

        this._superClass = class_;
    }

    /**
     * Sets the constructor arguments.
     *
     * @param {Array} args
     */
    set constructorArguments(args) {
        this._constructorArgs = args;
    }

    /**
     * Gets the instance.
     *
     * @returns {Object}
     */
    getInstance() {
        if (undefined === this._instance) {
            this._double();
        }

        return this._instance;
    }

    /**
     * Creates the double.
     *
     * @private
     */
    _double() {
        const self = this;
        const doubleClass = (new ClassGenerator(this._superClass, this._interfaces)).generate();
        const reflection = new ReflectionClass(doubleClass);
        const obj = undefined === this._constructorArgs ?
            reflection.newInstanceWithoutConstructor() :
            reflection.newInstance(...this._constructorArgs);

        for (const methodName of reflection.methods) {
            if ('constructor' === methodName || '__construct' === methodName) {
                continue;
            }

            const reflMethod = reflection.getMethod(methodName);
            let method;

            if (reflMethod.isGenerator) {
                method = function * (...$args) {
                    return yield * self._prophecy.makeProphecyMethodCall(methodName, $args);
                };
            } else if (reflMethod.isAsync) {
                method = function (...$args) {
                    return Promise.resolve(self._prophecy.makeProphecyMethodCall(methodName, $args));
                };
            } else {
                method = function (...$args) {
                    return self._prophecy.makeProphecyMethodCall(methodName, $args);
                };
            }

            obj[methodName] = method;
        }

        for (const propertyName of reflection.properties) {
            const descriptor = reflection.getPropertyDescriptor(propertyName);

            if (reflection.hasReadableProperty(propertyName)) {
                descriptor.get = function () {
                    return self._prophecy.makeProphecyMethodCall(propertyName, []);
                };
            }

            if (reflection.hasWritableProperty(propertyName)) {
                descriptor.set = function (value) {
                    return self._prophecy.makeProphecyMethodCall(propertyName, [ value ]);
                };
            }

            Object.defineProperty(obj, propertyName, descriptor);
        }

        return this._instance = obj;
    }
}
