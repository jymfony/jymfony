const ReflectionMethod = require('./ReflectionMethod');
const ReflectionField = require('./ReflectionField');
const ReflectionProperty = require('./ReflectionProperty');

const Storage = function () {};
Storage.prototype = {};

const TheBigReflectionDataCache = new Storage();
TheBigReflectionDataCache.classes = new Storage();
TheBigReflectionDataCache.data = new Storage();

const getClass = function getClass(value) {
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
        throw new ReflectionException('Unknown class');
    }

    return value;
};

/**
 * Utility class for classes reflection.
 */
class ReflectionClass {
    /**
     * Constructor.
     *
     * @param {string|Object} value
     */
    constructor(value) {
        this._isInterface = false;
        this._isTrait = false;
        value = getClass.apply(this, [ value ]);

        this._methods = new Storage();
        this._staticMethods = new Storage();
        this._readableProperties = new Storage();
        this._writableProperties = new Storage();
        this._properties = new Storage();
        this._constants = new Storage();
        this._fields = new Storage();
        this._staticFields = new Storage();
        this._interfaces = [];
        this._traits = [];

        this._docblock = undefined;
        if (undefined !== value[Symbol.docblock]) {
            this._docblock = value[Symbol.docblock];
        }

        if (undefined !== value[Symbol.reflection] && 'function' === typeof value[Symbol.reflection].isModule && value[Symbol.reflection].isModule(value)) {
            this._loadFromMetadata(value);
        } else {
            this._loadWithoutMetadata(value);
        }
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
            if (! (e instanceof ReflectionException)) {
                throw e;
            }

            return false;
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
        const surrogateCtor = function () { };
        surrogateCtor.prototype = this._constructor.prototype;

        return new surrogateCtor();
    }

    /**
     * Checks if this class contains a method.
     *
     * @param {string|Symbol} name
     *
     * @returns {boolean}
     */
    hasMethod(name) {
        return this._methods[name] !== undefined || this._staticMethods[name] !== undefined;
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
     * @returns {boolean}
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
     * @returns {boolean}
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
        return !! this._fields[name] || !! this._staticFields[name];
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

            try {
                r = new ReflectionClass(parent);
            } catch (e) {
                continue;
            }

            if (parent === r.getConstructor()[Symbol.for('_jymfony_mixin')]) {
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

        return this._constructor.prototype instanceof superClass;
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
            || this._constructor.prototype instanceof superClass;
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
        return this._namespace ? this._className.substr(this.namespaceName.length + 1) : this._className;
    }

    /**
     * The Namespace object containing this class.
     *
     * @returns {Jymfony.Component.Autoloader.Namespace}
     */
    get namespace() {
        return this._namespace;
    }

    /**
     * The namespace name.
     *
     * @returns {string}
     */
    get namespaceName() {
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
     * @returns {Array}
     */
    get methods() {
        return [ ...Object.keys(this._methods), ...Object.keys(this._staticMethods) ];
    }

    /**
     * Gets the docblock for this class.
     *
     * @returns {string}
     */
    get docblock() {
        return this._docblock.class;
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
        return MetadataStorage.getMetadata(this._constructor, null);
    }

    /**
     * @param {Object} value
     *
     * @private
     */
    _loadFromMetadata(value) {
        const metadata = value[Symbol.reflection];
        this._className = metadata.fqcn;
        this._namespace = metadata.namespace;

        if (TheBigReflectionDataCache.data[this._className]) {
            this._loadFromCache();
            return;
        }

        this._filename = metadata.filename;
        this._module = metadata.module;
        this._constructor = this._isInterface ? value : metadata.constructor;
        this._fields = metadata.fields;
        this._staticFields = metadata.staticFields;

        this._loadProperties();
        this._loadStatics();

        if (undefined === TheBigReflectionDataCache.data[this._className]) {
            TheBigReflectionDataCache.data[this._className] = {
                filename: this._filename,
                module: this._module,
                constructor: this._constructor,
                methods: this._methods,
                staticMethods: this._staticMethods,
                constants: this._constants,
                properties: {
                    all: this._properties,
                    readable: Object.keys(this._readableProperties),
                    writable: Object.keys(this._writableProperties),
                },
                interfaces: this._interfaces,
                traits: this._traits,
                fields: this._fields,
                staticFields: this._staticFields,
            };
        }
    }

    /**
     * @private
     */
    _loadFromCache() {
        const data = TheBigReflectionDataCache.data[this._className];

        const propFunc = function (storage, data) {
            for (const v of data) {
                storage[v] = true;
            }
        };

        this._filename = data.filename;
        this._module = data.module;
        this._constructor = data.constructor;
        this._methods = data.methods;
        this._staticMethods = data.staticMethods;
        this._constants = data.constants;
        this._properties = data.properties.all;
        propFunc(this._readableProperties, data.properties.readable);
        propFunc(this._writableProperties, data.properties.writable);
        this._interfaces = data.interfaces;
        this._traits = data.traits;
        this._fields = data.fields;
        this._staticFields = data.staticFields;
    }

    /**
     * @private
     */
    _loadWithoutMetadata(value) {
        this._className = undefined;
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
            if (undefined === proto || null === proto) {
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
                    this._methods[name] = descriptor;
                } else {
                    if ('function' === typeof descriptor.get) {
                        this._properties[name] = descriptor;
                        this._readableProperties[name] = true;
                    }

                    if ('function' === typeof descriptor.set) {
                        this._properties[name] = descriptor;
                        this._writableProperties[name] = true;
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
    _loadStatics() {
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
                        this._staticMethods[P] = descriptor.value;
                        return false;
                    }

                    return -1 === FunctionProps.indexOf(P);
                });

            for (const name of names) {
                if (Symbol.reflection === name) {
                    continue;
                }

                if (! consts.hasOwnProperty(name) && Object.prototype.hasOwnProperty.call(parent, name)) {
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
