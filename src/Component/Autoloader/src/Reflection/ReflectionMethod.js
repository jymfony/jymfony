const MetadataHelper = require('../Metadata/MetadataHelper');
const ReflectionParameter = require('./ReflectionParameter');
const ReflectorTrait = require('./ReflectorTrait');

/**
 * Reflection utility for class method.
 */
class ReflectionMethod extends implementationOf(ReflectorInterface, ReflectorTrait) {
    /**
     * @type {string}
     *
     * @private
     */
    _name;

    /**
     * @type {boolean}
     *
     * @private
     */
    _private;

    /**
     * @type {Function}
     *
     * @private
     */
    _method;

    /**
     * @type {boolean}
     *
     * @private
     */
    _static;

    /**
     * @type {ReflectionClass}
     *
     * @private
     */
    _class;

    /**
     * @type {string}
     *
     * @private
     */
    _type;

    /**
     * @type {boolean}
     *
     * @private
     */
    _async;

    /**
     * @type {ReflectionParameter[]}
     *
     * @private
     */
    _parameters = [];

    /**
     * @type {string}
     *
     * @private
     */
    _docblock;

    /**
     * Constructor.
     *
     * @param {ReflectionClass} reflectionClass
     * @param {string} methodName
     */
    constructor(reflectionClass, methodName) {
        super();

        this._name = methodName;
        const method = reflectionClass._methods[methodName];
        if (undefined === method) {
            throw new ReflectionException('Unknown method "' + methodName + '\'');
        }

        this._private = method.private;
        this._method = method.access.get();
        this._static = method.static;
        this._class = new ReflectionClass(method.ownClass);
        this._type = isGeneratorFunction(this._method) ? ReflectionMethod.GENERATOR : ReflectionMethod.FUNCTION;
        this._async = isAsyncFunction(this._method);
        if (method.parameters !== undefined) {
            this._parameters = method.parameters.map(p => new ReflectionParameter(this, p.name, p.index, p.hasDefault, p['default'], p.isObjectPattern, p.isArrayPattern, p.isRestElement));
        }

        this._docblock = this._method[Symbol.docblock];

        return Object.freeze(this);
    }

    /**
     * Invokes the method.
     *
     * @param {*} object
     * @param {*[]} args
     *
     * @returns {*}
     */
    invoke(object, ...args) {
        return this._method.call(object, ...args);
    }

    /**
     * Gets the reflection class.
     *
     * @returns {ReflectionClass}
     */
    get reflectionClass() {
        return this._class;
    }

    /**
     * Gets the method name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Gets if this method is static.
     *
     * @returns {boolean}
     */
    get isStatic() {
        return this._static;
    }

    /**
     * If this method is private.
     *
     * @returns {boolean}
     */
    get isPrivate() {
        return this._private;
    }

    /**
     * Gets if the function is a generator.
     *
     * @returns {boolean}
     */
    get isGenerator() {
        return this._type === ReflectionMethod.GENERATOR;
    }

    /**
     * Is this function async?
     *
     * @returns {boolean}
     */
    get isAsync() {
        return this._async;
    }

    /**
     * Docblock.
     *
     * @returns {string}
     */
    get docblock() {
        return this._docblock;
    }

    /**
     * Gets the class metadata.
     *
     * @returns {[Function, *][]}
     */
    get metadata() {
        const metadata = this._class.getConstructor()[Symbol.metadata];
        if (undefined === metadata) {
            return [];
        }

        const target = MetadataHelper.getMetadataTarget({ kind: 'method', name: this._name, metadata });
        const storage = MetadataStorage.getMetadata(target);

        return [ ...(function * () {
            for (const [ class_, data ] of storage) {
                for (const datum of isArray(data) ? data : [ data ]) {
                    yield [ class_, datum ];
                }
            }
        }()) ];
    }

    /**
     * Gets the method parameters' reflection objects.
     *
     * @returns {ReflectionParameter[]}
     */
    get parameters() {
        return this._parameters;
    }

    /**
     * Gets the reflected method.
     *
     * @returns {Function}
     */
    get method() {
        return this._method;
    }
}

ReflectionMethod.FUNCTION = 'function';
ReflectionMethod.ASYNC_FUNCTION = 'async function';
ReflectionMethod.GENERATOR = 'generator';

module.exports = global.ReflectionMethod = ReflectionMethod;
