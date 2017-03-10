const ReflectionException = require('../Exception/ReflectionException');

let Storage = function () {};
Storage.prototype = {};

let TheBigReflectionDataCache = new Storage();
TheBigReflectionDataCache.classes = new Storage();
TheBigReflectionDataCache.data = new Storage();

/**
 * Utility class for classes reflection
 *
 * @type ReflectionClass
 */
global.ReflectionClass = class ReflectionClass {
    constructor(value) {
        if ('string' === typeof value) {
            let cached = TheBigReflectionDataCache.classes[value];
            if (cached) {
                value = cached;
            } else {
                let parts = value.split('.');
                value = ReflectionClass._recursiveGet(global, parts);
            }
        } else if ('object' === typeof value && undefined !== value.constructor) {
            value = value.constructor;
        }

        if ('function' === typeof value) {
            if (undefined === value.prototype) {
                if (value.definition) {
                    // Interface or Trait
                    value = value.definition;
                } else {
                    throw new ReflectionException('Not a class');
                }
            }
        } else if (undefined === value) {
            throw new ReflectionException('Unknown class');
        }

        this._methods = new Storage();
        this._readableProperties = new Storage();
        this._writableProperties = new Storage();
        this._properties = new Storage();
        this._constants = new Storage();

        if (undefined !== value[Symbol.reflection]) {
            this._loadFromMetadata(value);
        } else {
            this._loadWithoutMetadata(value);
        }
    }

    /**
     * Checks if a class exists
     *
     * @param {string} className
     */
    static exists(className) {
        try {
            new ReflectionClass(className);
        } catch (e) {
            if (! (e instanceof ReflectionException)) {
                throw e;
            }

            return false;
        }

        return true;
    }

    /**
     * Construct a new object
     *
     * @param {...*} var_args Arguments to constructor
     *
     * @returns {*}
     */
    newInstance(...var_args) {
        return new this._constructor(...var_args);
    }

    /**
     * Construct a new object without calling its constructor
     *
     * @returns {*}
     */
    newInstanceWithoutConstructor() {
        let surrogateCtor = function () { };
        surrogateCtor.prototype = this._constructor.prototype;

        return new surrogateCtor();
    }

    /**
     * Checks if this class contains a method
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    hasMethod(name) {
        return this._methods[name] !== undefined;
    }

    /**
     * Checks if class has defined property (getter/setter)
     *
     * @param name
     *
     * @returns {boolean}
     */
    hasProperty(name) {
        return this._properties[name] !== undefined;
    }

    /**
     * Checks if class has readable property (getter)
     *
     * @param name
     *
     * @returns {boolean}
     */
    hasReadableProperty(name) {
        return this._readableProperties[name] !== undefined;
    }

    /**
     * Checks if class has writable property (setter)
     *
     * @param name
     *
     * @returns {boolean}
     */
    hasWritableProperty(name) {
        return this._writableProperties[name] !== undefined;
    }

    /**
     * Returns the ReflectionClass object for the parent class
     *
     * @returns {ReflectionClass}
     */
    getParentClass() {
        let parent = this._constructor;
        while (parent = Object.getPrototypeOf(parent)) {
            if (parent.isMixin) {
                continue;
            }

            break;
        }

        try {
            return new ReflectionClass(parent);
        } catch (e) {
            return undefined;
        }
    }

    /**
     * Gets the class constructor
     *
     * @returns {Function}
     */
    getConstructor() {
        return this._constructor;
    }

    /**
     * Get the fully qualified name of the reflected class
     *
     * @returns {string|undefined}
     */
    get name() {
        return this._className;
    }

    /**
     * Get the Namespace object containing this class
     *
     * @returns {Jymfony.Component.Autoloader.Namespace}
     */
    get namespace() {
        return this._namespace;
    }

    /**
     * Get the namespace name
     *
     * @returns {string}
     */
    get namespaceName() {
        return this._namespace.name;
    }

    /**
     * Filename declaring this class
     *
     * @returns {string}
     */
    get filename() {
        return this._filename;
    }

    /**
     * Module object exporting this class
     *
     * @returns {Module}
     */
    get module() {
        return this._module;
    }

    /**
     * Get all methods names
     *
     * @returns {Array}
     */
    get methods() {
        return Object.keys(this._methods);
    }

    /**
     * Get properties name defined by setters/getters
     * Other properties are added dynamically and are not
     * enumerable in the prototype
     *
     * @returns {Array}
     */
    get properties() {
        return Object.keys(this._properties);
    }

    /**
     * Get constants
     *
     * @returns {Object.<string, *>}
     */
    get constants() {
        return Object.assign({}, this._constants);
    }

    _loadFromMetadata(value) {
        let metadata = value[Symbol.reflection];
        this._className = metadata.fqcn;
        this._namespace = metadata.namespace;

        if (TheBigReflectionDataCache.classes[this._className]) {
            this._loadFromCache();
            return;
        }

        this._filename = metadata.filename;
        this._module = metadata.module;
        this._constructor = metadata.constructor;

        this._loadProperties();
        this._loadConstants();

        if (undefined === TheBigReflectionDataCache.classes[this._className]) {
            TheBigReflectionDataCache.classes[this._className] = metadata.constructor;
            TheBigReflectionDataCache.data[this._className] = {
                filename: this._filename,
                module: this._module,
                constructor: this._constructor,
                methods: this._methods,
                constants: this._constants,
                properties: {
                    all: Object.keys(this._properties),
                    readable: Object.keys(this._readableProperties),
                    writable: Object.keys(this._writableProperties),
                },
            };
        }
    }

    _loadFromCache() {
        let data = TheBigReflectionDataCache.data[this._className];

        let propFunc = function (storage, data) {
            for (let v of data) {
                storage[v] = true;
            }
        };

        this._filename = data.filename;
        this._module = data.module;
        this._constructor = data.constructor;
        this._methods = data.methods;
        this._constants = data.constants;
        propFunc(this._properties, data.properties.all);
        propFunc(this._readableProperties, data.properties.readable);
        propFunc(this._writableProperties, data.properties.writable);
    }

    _loadWithoutMetadata(value) {
        this._className = undefined;
        this._module = ReflectionClass._searchModule(value);
        this._filename = this._module ? this._module.filename : undefined;
        this._constructor = value;
        this._namespace = undefined;

        this._loadProperties();
        this._loadConstants();
    }

    _loadProperties() {
        let loadFromPrototype = (proto) => {
            let properties = Object.getOwnPropertyNames(proto);
            for (let name of properties) {
                if ('constructor' === name) {
                    continue;
                }

                let descriptor = Object.getOwnPropertyDescriptor(proto, name);
                if ('function' === typeof descriptor.value) {
                    this._methods[name] = descriptor.value;
                } else {
                    if ('function' === typeof descriptor.get) {
                        this._properties[name] =
                            this._readableProperties[name] = true;
                    }

                    if ('function' === typeof descriptor.set) {
                        this._properties[name] =
                            this._writableProperties[name] = true;
                    }
                }
            }
        };

        let parent = this._constructor;
        let chain = [ this._constructor.prototype ];
        while (parent = Object.getPrototypeOf(parent)) {
            if (parent.prototype) {
                chain.unshift(parent.prototype);
            }
        }

        for (let p of chain) {
            loadFromPrototype(p);
        }
    }

    _loadConstants() {
        const FunctionProps = Object.getOwnPropertyNames(Function.prototype);

        let parent = this._constructor;
        let chain = [ this._constructor ];
        while (parent = Object.getPrototypeOf(parent)) {
            if (parent.prototype) {
                chain.unshift(parent.prototype.constructor);
            }
        }

        let consts = {};
        for (parent of chain) {
            let names = Object.getOwnPropertyNames(parent)
                .filter(P => {
                    if ('prototype' === P || 'isMixin' === P) {
                        return false;
                    }

                    if ('arguments' === P || 'caller' === P) {
                        // 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context.
                        return false;
                    }

                    if ('function' === typeof parent[P]) {
                        return false;
                    }

                    return -1 === FunctionProps.indexOf(P);
                });

            for (let name of names) {
                if (! consts.hasOwnProperty(name)) {
                    consts[name] = parent[name];
                }
            }
        }

        this._constants = consts;
    }

    static _recursiveGet(start, parts) {
        let part;
        let original = parts.join('.');
        parts = [ ...parts ].reverse();

        while (part = parts.pop()) {
            if (undefined === start) {
                throw new ReflectionException('Requesting non-existent class ' + original);
            }

            start = start[part];
        }

        return start;
    }

    static _searchModule(value) {
        for (let moduleName of Object.keys(require.cache)) {
            let mod = require.cache[moduleName];
            if (mod.exports === value) {
                return mod;
            }
        }

        return undefined;
    }
};
