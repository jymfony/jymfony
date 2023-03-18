const ReflectorInterface = require('./ReflectorInterface');
const ReflectorTrait = require('./ReflectorTrait');
const ReflectionMethod = require('./ReflectionMethod');
const ReflectionField = require('./ReflectionField');
const ReflectionProperty = require('./ReflectionProperty');
const ClassNotFoundException = require('../Exception/ClassNotFoundException');

const Storage = function () {};
Storage.prototype = {};

const TheBigReflectionDataCache = new Storage();
TheBigReflectionDataCache.classes = new Storage();
TheBigReflectionDataCache.data = new WeakMap();
TheBigReflectionDataCache.reflection = new WeakMap();

const getClass = function getClass(value) {
    const originalValue = value;
    if (!! value && value.__self__ !== undefined) {
        value = value.__self__;
    }

    if ('string' === typeof value) {
        const cached = TheBigReflectionDataCache.classes[value];
        if (cached) {
            value = cached;
        } else {
            const parts = value.split('.');
            const name = value;
            value = ReflectionClass._recursiveGet(global, parts);

            if (undefined !== value) {
                TheBigReflectionDataCache.classes[name] = value;
            }
        }
    } else if ('object' === typeof value && undefined !== value.constructor) {
        value = value.constructor;
    }

    if ('function' === typeof value) {
        if (undefined === value.prototype) {
            if (value.definition) {
                // Interface or Trait
                this._isInterface = global.mixins.isInterface(value);
                this._isTrait = global.mixins.isTrait(value);
                value = value.definition;
            } else {
                throw new ReflectionException('Not a class');
            }
        }
    } else if (undefined === value) {
        throw new ReflectionException('Unknown class ' + originalValue);
    }

    return value;
};

/**
 * Utility class for classes reflection.
 */
class ReflectionClass extends implementationOf(ReflectorInterface, ReflectorTrait) {
    /**
     * Constructor.
     *
     * @param {string|Object} value
     */
    constructor(value) {
        super();
        this._isInterface = false;
        this._isTrait = false;
        value = getClass.apply(this, [ value ]);

        const cached = TheBigReflectionDataCache.reflection.get(value);
        if (cached !== undefined) {
            cached._isInterface = this._isInterface;
            cached._isTrait = this._isTrait;
            return cached;
        }

        this._methods = new Storage();
        this._readableProperties = new Storage();
        this._writableProperties = new Storage();
        this._properties = new Storage();
        this._constants = new Storage();
        this._fields = new Storage();
        this._interfaces = [];
        this._traits = [];
        this._docblock = undefined;

        if (value.hasOwnProperty(Symbol.reflection)) {
            this._loadFromMetadata(value);
        } else {
            this._loadWithoutMetadata(value);
        }

        TheBigReflectionDataCache.reflection.set(value, this);
    }

    /**
     * Checks if a class exists.
     *
     * @param {string} className
     */
    static exists(className) {
        try {
            getClass(className);
        } catch (e) {
            if (e instanceof ReflectionException || e instanceof ClassNotFoundException) {
                return false;
            }

            throw e;
        }

        return true;
    }

    /**
     * Gets a class constructor given an object or a string
     * containing a FQCN.
     *
     * @param {string|Object} className
     */
    static getClass(className) {
        return getClass(className);
    }

    /**
     * Gets a FQCN from an object, constructor or a string.
     *
     * @param {string|Object} className
     *
     * @returns {string}
     */
    static getClassName(className) {
        try {
            return (new ReflectionClass(className)).name;
        } catch (e) {
            return 'Object';
        }
    }

    /**
     * Construct a new object.
     *
     * @param {...*} varArgs Arguments to constructor
     *
     * @returns {*}
     */
    newInstance(...varArgs) {
        return new this._constructor(...varArgs);
    }

    /**
     * Construct a new object without calling its constructor.
     *
     * @returns {*}
     */
    newInstanceWithoutConstructor() {
        const surrogateCtor = function _reflectionClass_surrogateCtor_() { };
        surrogateCtor.prototype = this._constructor.prototype;

        const obj = new surrogateCtor();
        if (this.hasMethod('__invoke')) {
            return new __jymfony.ManagedProxy(obj.__invoke, proxy => {
                proxy.target = obj;
                return null;
            }, {
                get: (target, key) => {
                    if ('__self__' === key) {
                        return target;
                    }

                    return Reflect.get(target, key);
                },
                apply: (target, ctx, args) => {
                    return target.__invoke(...args);
                },
                preventExtensions: (target) => {
                    Reflect.preventExtensions(target);

                    return false;
                },
                getOwnPropertyDescriptor: (target, key) => {
                    if ('__self__' === key) {
                        return { configurable: true, enumerable: false };
                    }

                    return Reflect.getOwnPropertyDescriptor(target, key);
                },
            });
        }

        return obj;
    }

    /**
     * Checks if this class contains a method.
     *
     * @param {string|Symbol} name
     *
     * @returns {boolean}
     */
    hasMethod(name) {
        return this._methods[name] !== undefined;
    }

    /**
     * Gets the reflection method instance for a given method name.
     *
     * @param {string|Symbol} name
     *
     * @returns {ReflectionMethod}
     */
    getMethod(name) {
        return new ReflectionMethod(this, name);
    }

    /**
     * Checks if class has defined property (getter/setter).
     *
     * @param {string|Symbol} name
     *
     * @returns {boolean}
     */
    hasProperty(name) {
        return this._properties[name] !== undefined;
    }

    /**
     * Checks if class has readable property (getter).
     *
     * @param {string|Symbol} name
     *
     * @returns {boolean}
     */
    hasReadableProperty(name) {
        return this._readableProperties[name] !== undefined;
    }

    /**
     * Gets the readable property (getter) reflection object.
     *
     * @param {string|Symbol} name
     *
     * @returns {ReflectionProperty}
     */
    getReadableProperty(name) {
        return new ReflectionProperty(this, ReflectionProperty.KIND_GET, name);
    }

    /**
     * Checks if class has writable property (setter).
     *
     * @param {string|Symbol} name
     *
     * @returns {boolean}
     */
    hasWritableProperty(name) {
        return this._writableProperties[name] !== undefined;
    }

    /**
     * Gets the writable property (setter) reflection object.
     *
     * @param {string|Symbol} name
     *
     * @returns {ReflectionProperty}
     */
    getWritableProperty(name) {
        return new ReflectionProperty(this, ReflectionProperty.KIND_SET, name);
    }

    /**
     * Checks if class has defined the given class field.
     *
     * @param {string} name
     *
     * @returns {boolean}
     */
    hasField(name) {
        return !! this._fields[name];
    }

    /**
     * Gets the reflection field instance for a given field name.
     *
     * @param {string} name
     *
     * @returns {ReflectionField}
     */
    getField(name) {
        return new ReflectionField(this, name);
    }

    /**
     * Gets the property descriptor.
     *
     * @param {string|Symbol} name
     *
     * @returns {*}
     */
    getPropertyDescriptor(name) {
        if (undefined === this._properties[name]) {
            throw new ReflectionException('Property "' + name + '\' does not exist.');
        }

        return this._properties[name];
    }

    /**
     * Returns the ReflectionClass object for the parent class.
     *
     * @returns {ReflectionClass}
     */
    getParentClass() {
        let parent = this._constructor;
        let r;
        while ((parent = Object.getPrototypeOf(parent))) {
            if (parent === Object || parent === Object.prototype) {
                return undefined;
            }

            if (parent === parent[Symbol.for('_jymfony_mixin')]) {
                continue;
            }

            try {
                r = new ReflectionClass(parent);
            } catch (e) {
                continue;
            }

            break;
        }

        try {
            return r;
        } catch (e) {
            return undefined;
        }
    }

    /**
     * Gets the class constructor.
     *
     * @returns {Function}
     */
    getConstructor() {
        return this._constructor;
    }

    /**
     * @returns {ReflectionMethod | null}
     */
    get constructorMethod() {
        if (this._methods['constructor']) {
            return this.getMethod('constructor');
        }

        if (this._methods['__construct']) {
            return this.getMethod('__construct');
        }

        return null;
    }

    /**
     * Checks whether this class is a subclass of a given subclass.
     *
     * @param {Function|string} superClass
     *
     * @returns {boolean}
     */
    isSubclassOf(superClass) {
        if ('string' === typeof superClass) {
            superClass = ReflectionClass._recursiveGet(global, superClass.split('.'));
        }

        return this._constructor.prototype instanceof superClass
            || (this._isInterface && mixins.getParents(this._constructor).includes(superClass));
    }

    /**
     * Checks whether this class is an instance of the given class.
     *
     * @param {Function|string} superClass
     *
     * @returns {boolean}
     */
    isInstanceOf(superClass) {
        if ('string' === typeof superClass) {
            superClass = ReflectionClass._recursiveGet(global, superClass.split('.'));
        }

        return this._constructor === superClass
            || this._constructor === new ReflectionClass(superClass).getConstructor()
            || this._constructor.prototype instanceof superClass
            || (this._isInterface && mixins.getParents(this._constructor).includes(superClass));
    }

    /**
     * Is this class an interface?
     *
     * @returns {boolean}
     */
    get isInterface() {
        return this._isInterface;
    }

    /**
     * Is this class a trait?
     *
     * @returns {boolean}
     */
    get isTrait() {
        return this._isTrait;
    }

    /**
     * The fully qualified name of the reflected class.
     *
     * @returns {string|undefined}
     */
    get name() {
        return this._className;
    }

    /**
     * The class short name (without namespace).
     *
     * @returns {string}
     */
    get shortName() {
        return this._namespace ? this._className.substring(this.namespaceName.length + 1) : this._className;
    }

    /**
     * The Namespace object containing this class.
     *
     * @returns {null|Jymfony.Component.Autoloader.Namespace}
     */
    get namespace() {
        return this._namespace || null;
    }

    /**
     * The namespace name.
     *
     * @returns {null|string}
     */
    get namespaceName() {
        if (! this._namespace) {
            return null;
        }

        return this._namespace.name;
    }

    /**
     * Filename declaring this class.
     *
     * @returns {string}
     */
    get filename() {
        return this._filename;
    }

    /**
     * Module object exporting this class.
     *
     * @returns {NodeJS.Module}
     */
    get module() {
        return this._module;
    }

    /**
     * Get all methods names.
     *
     * @returns {string[]}
     */
    get methods() {
        return [ ...Object.keys(this._methods) ];
    }

    /**
     * Gets the docblock for this class.
     *
     * @returns {string}
     */
    get docblock() {
        return this._docblock;
    }

    /**
     * Gets the fields names.
     *
     * @returns {Array}
     */
    get fields() {
        return Object.keys(this._fields);
    }

    /**
     * Get properties name defined by setters/getters.
     * Other properties are added dynamically and are not
     * enumerable in the prototype.
     *
     * @returns {Array}
     */
    get properties() {
        return Object.keys(this._properties);
    }

    /**
     * Get constants.
     *
     * @returns {Object.<string, *>}
     */
    get constants() {
        return Object.assign({}, this._constants);
    }

    /**
     * Get interfaces reflection classes.
     *
     * @returns {ReflectionClass[]}
     */
    get interfaces() {
        return [ ...this._interfaces ];
    }

    /**
     * Get traits reflection classes.
     *
     * @returns {ReflectionClass[]}
     */
    get traits() {
        return [ ...this._traits ];
    }

    /**
     * Gets the class metadata.
     *
     * @returns {[Function, *][]}
     */
    get metadata() {
        const sym = this._constructor[Symbol.metadata];
        if (undefined === sym) {
            return [];
        }

        return MetadataStorage.getMetadata(sym, null);
    }

    /**
     * @param {Object} value
     *
     * @private
     */
    _loadFromMetadata(value) {
        const { Compiler } = __jymfony.autoload.classLoader.constructor.compiler;
        const metadata = Compiler.getReflectionData(value);
        if (metadata === undefined) {
            this._loadWithoutMetadata(value);
            return;
        }

        this._className = metadata.fqcn;
        this._namespace = (() => {
            if (metadata.namespace) {
                try {
                    const ns = ReflectionClass._recursiveGet(global, metadata.namespace.split('.'));
                    return ns ? ns.__namespace : null;
                } catch (e) {
                    // Do nothing
                }
            }

            return null;
        })();
        this._docblock = metadata.docblock;

        if (TheBigReflectionDataCache.data.has(value)) {
            this._loadFromCache(value);
            return;
        }

        this._filename = metadata.filename;
        this._module = metadata.module;
        this._constructor = this._isInterface || this._isTrait ? value : (metadata.self || metadata.constructor);

        if (metadata.fields) {
            for (const field of metadata.fields) {
                this._fields[field.name] = field;
            }
        }

        if (metadata.methods) {
            for (const method of metadata.methods) {
                switch (method.kind) {
                    case 'get':
                    case 'set':
                        if (this._properties[method.name] && this._properties[method.name].kind !== method.kind) {
                            this._properties[method.name].kind = 'accessor';
                            this._properties[method.name][method.kind] = method.value;
                        } else {
                            const nm = { ...method };
                            nm[method.kind] = nm.value;
                            delete nm.value;

                            this._properties[method.name] = nm;
                        }

                        this['get' === method.kind ? '_readableProperties' : '_writableProperties'][method.name] = true;
                        break;

                    default:
                        this._methods[method.name] = method;
                }
            }
        }

        this._loadStatics(false);

        const parent = this.getParentClass();
        if (parent) {
            const parentFields = parent._fields;
            for (const name of Object.keys(parentFields)) {
                if ('#' !== name[0] && ! (name in this._fields)) {
                    this._fields[name] = parentFields[name];
                }
            }

            const parentMethods = parent._methods;
            for (const name of Object.keys(parentMethods)) {
                if ('#' !== name[0] && ! (name in this._methods)) {
                    this._methods[name] = parentMethods[name];
                }
            }

            const parentProperties = parent._properties;
            for (const name of Object.keys(parentProperties)) {
                if ('#' !== name[0] && ! (name in this._properties)) {
                    this._properties[name] = parentProperties[name];
                    if (undefined !== parent._writableProperties[name]) {
                        this._writableProperties[name] = parent._writableProperties[name];
                    }
                    if (undefined !== parent._readableProperties[name]) {
                        this._readableProperties[name] = parent._readableProperties[name];
                    }
                }
            }
        }

        if (this._isInterface || this._isTrait) {
            return;
        }

        for (const IF of global.mixins.getInterfaces(this._constructor)) {
            const reflectionInterface = new ReflectionClass(IF);
            this._interfaces.push(reflectionInterface);

            const interfaceConstants = reflectionInterface._constants;
            for (const name of Object.keys(interfaceConstants)) {
                if ('#' !== name[0] && !(name in this._constants)) {
                    this._constants[name] = interfaceConstants[name];
                }
            }
        }

        for (const TR of global.mixins.getTraits(this._constructor)) {
            const reflectionTrait = new ReflectionClass(TR);
            this._traits.push(reflectionTrait);

            const traitMethods = reflectionTrait._methods;
            for (const name of Object.keys(traitMethods)) {
                if ('#' !== name[0] && !(name in this._methods)) {
                    this._methods[name] = {
                        ...traitMethods[name],
                        ownClass: this._constructor,
                    };
                }
            }
        }

        if (!TheBigReflectionDataCache.data.has(value)) {
            TheBigReflectionDataCache.data.set(value, {
                filename: this._filename,
                module: this._module,
                constructor: this._constructor,
                methods: this._methods,
                constants: this._constants,
                properties: {
                    all: this._properties,
                    readable: Object.keys(this._readableProperties),
                    writable: Object.keys(this._writableProperties),
                },
                interfaces: this._interfaces,
                traits: this._traits,
                fields: this._fields,
                docblock: this._docblock,
            });
        }
    }

    /**
     * @private
     */
    _loadFromCache(value) {
        const data = TheBigReflectionDataCache.data.get(value);

        const propFunc = function (storage, data) {
            for (const v of data) {
                storage[v] = true;
            }
        };

        this._filename = data.filename;
        this._module = data.module;
        this._constructor = data.constructor;
        this._methods = data.methods;
        this._constants = data.constants;
        this._properties = data.properties.all;
        propFunc(this._readableProperties, data.properties.readable);
        propFunc(this._writableProperties, data.properties.writable);
        this._interfaces = data.interfaces;
        this._traits = data.traits;
        this._fields = data.fields;
        this._docblock = data.docblock;
    }

    /**
     * @private
     */
    _loadWithoutMetadata(value) {
        this._className = value.name;
        this._module = ReflectionClass._searchModule(value);
        this._filename = this._module ? this._module.filename : undefined;
        this._constructor = value;
        this._namespace = undefined;

        this._loadProperties();
        this._loadStatics();
    }

    /**
     * @private
     */
    _loadProperties() {
        const loadFromPrototype = (proto) => {
            if (undefined === proto || null === proto || Function === proto || Function === proto.constructor) {
                return;
            }

            const properties = [ ...Object.getOwnPropertyNames(proto), ...Object.getOwnPropertySymbols(proto) ];
            for (const name of properties) {
                if ('constructor' === name || 'arguments' === name || 'caller' === name) {
                    continue;
                }

                let descriptor;
                try {
                    descriptor = Object.getOwnPropertyDescriptor(proto, name);
                } catch (e) {
                    // Non-configurable property.
                    continue;
                }

                if ('function' === typeof descriptor.value) {
                    if ('__construct' === name) {
                        continue;
                    }

                    this._methods[name] = {
                        name,
                        kind: 'method',
                        static: false,
                        private: false,
                        value: descriptor.value,
                        ownClass: proto.constructor,
                    };
                } else {
                    if ('function' === typeof descriptor.get || 'function' === typeof descriptor.set) {
                        this._properties[name] = {
                            name,
                            static: false,
                            private: false,
                            get: descriptor.get,
                            set: descriptor.set,
                            ownClass: proto.constructor,
                        };
                        this._readableProperties[name] = 'function' === typeof descriptor.get;
                        this._writableProperties[name] = 'function' === typeof descriptor.set;
                    }
                }
            }
        };

        let parent = this._constructor;
        const chain = [ this._constructor.prototype ];

        if (! this._isInterface) {
            chain.push(Object.getPrototypeOf(this._constructor));
        }

        while ((parent = Object.getPrototypeOf(parent))) {
            if (parent.prototype) {
                chain.unshift(parent.prototype);
            }
        }

        for (const p of chain) {
            loadFromPrototype(p);
        }

        if (this._isInterface || this._isTrait) {
            return;
        }

        for (const IF of global.mixins.getInterfaces(this._constructor)) {
            const reflectionInterface = new ReflectionClass(IF);
            this._interfaces.push(reflectionInterface);
        }

        for (const TR of global.mixins.getTraits(this._constructor)) {
            const reflectionTrait = new ReflectionClass(TR);
            this._traits.push(reflectionTrait);
        }
    }

    /**
     * @private
     */
    _loadStatics(methods = true) {
        const FunctionProps = [ ...Object.getOwnPropertyNames(Function.prototype), ...Object.getOwnPropertySymbols(Function.prototype) ];

        let parent = this._constructor;
        const chain = [ this._constructor ];
        while ((parent = Object.getPrototypeOf(parent))) {
            if (parent.prototype) {
                chain.unshift(parent.prototype.constructor);
            }
        }

        const consts = {};
        for (parent of chain) {
            const names = [ ...Object.getOwnPropertyNames(parent), ...Object.getOwnPropertySymbols(parent) ]
                .filter(P => {
                    if ('prototype' === P || Symbol.for('_jymfony_mixin') === P) {
                        return false;
                    }

                    if ('arguments' === P || 'caller' === P) {
                        // 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context.
                        return false;
                    }

                    let descriptor;
                    try {
                        descriptor = Object.getOwnPropertyDescriptor(parent, P);
                    } catch (e) {
                        // Non-configurable property.
                        return false;
                    }

                    if ('function' === typeof descriptor.value) {
                        if (methods) {
                            this._methods[P] = {
                                name: P,
                                kind: 'method',
                                static: true,
                                private: false,
                                value: descriptor.value,
                                ownClass: parent,
                            };
                        }

                        return false;
                    }

                    return -1 === FunctionProps.indexOf(P);
                });

            for (const name of names) {
                if ('symbol' !== typeof name && ! consts.hasOwnProperty(name) && Object.prototype.hasOwnProperty.call(parent, name)) {
                    const descriptor = Object.getOwnPropertyDescriptor(parent, name);

                    if (descriptor.hasOwnProperty('value')) {
                        consts[name] = descriptor.value;
                    }
                }
            }
        }

        this._constants = consts;
    }

    /**
     * @returns {Function}
     *
     * @private
     */
    static _recursiveGet(start, parts) {
        let part;

        // Save autoload debug flag.
        const debug = __jymfony.autoload.debug;
        __jymfony.autoload.debug = false;

        try {
            const original = parts.join('.');
            parts = [ ...parts ].reverse();

            while ((part = parts.pop())) {
                if (undefined === start) {
                    throw new ReflectionException('Requesting non-existent class ' + original);
                }

                start = start[part];
            }

            return start;
        } finally {
            // Restore debug flag.
            __jymfony.autoload.debug = debug;
        }
    }

    /**
     * @private
     */
    static _searchModule(value) {
        for (const moduleName of Object.keys(require.cache)) {
            const mod = require.cache[moduleName];
            if (mod.exports === value) {
                return mod;
            }
        }

        return undefined;
    }
}

global.ReflectionClass = ReflectionClass;
