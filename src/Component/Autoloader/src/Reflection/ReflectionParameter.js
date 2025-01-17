const MetadataHelper = require('../Metadata/MetadataHelper');
const ReflectorTrait = require('./ReflectorTrait');

/**
 * Reflection utility for method parameters.
 */
class ReflectionParameter extends implementationOf(ReflectorInterface, ReflectorTrait) {

    /**
     * @type {ReflectionMethod}
     *
     * @private
     */
    _reflectionMethod;

    /**
     * @type {null|string}
     *
     * @private
     */
    _name;

    /**
     * @type {int}
     *
     * @private
     */
    _index;

    /**
     * @type {boolean}
     *
     * @private
     */
    _objectPattern;

    /**
     * @type {boolean}
     *
     * @private
     */
    _arrayPattern;

    /**
     * @type {boolean}
     *
     * @private
     */
    _restElement;

    /**
     * @type {boolean}
     *
     * @private
     */
    _hasDefaultValue;

    /**
     * @type {*}
     *
     * @private
     */
    _scalarDefaultValue;

    /**
     * Constructor.
     *
     * @param {ReflectionMethod} reflectionMethod
     * @param {null|string} name
     * @param {int} index
     * @param {boolean} hasDefaultValue
     * @param {*} scalarDefaultValue
     * @param {boolean} objectPattern
     * @param {boolean} arrayPattern
     * @param {boolean} restElement
     *
     * @internal
     */
    constructor(
        reflectionMethod,
        name,
        index,
        hasDefaultValue = false,
        scalarDefaultValue = undefined,
        objectPattern = false,
        arrayPattern = false,
        restElement = false,
    ) {
        super();

        this._reflectionMethod = reflectionMethod;
        this._name = name;
        this._index = index;
        this._objectPattern = objectPattern;
        this._arrayPattern = arrayPattern;
        this._restElement = restElement;
        this._hasDefaultValue = hasDefaultValue;
        this._scalarDefaultValue = scalarDefaultValue;

        return Object.freeze(this);
    }

    /**
     * Gets the reflection class.
     *
     * @returns {ReflectionClass}
     */
    get reflectionClass() {
        return this._reflectionMethod.reflectionClass;
    }

    /**
     * Gets the reflection method.
     *
     * @returns {ReflectionMethod}
     */
    get reflectionMethod() {
        return this._reflectionMethod;
    }

    /**
     * Gets the parameter name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Whether the parameter has a default value.
     *
     * @returns {*}
     */
    get hasDefaultValue() {
        return this._hasDefaultValue;
    }

    /**
     * Gets the parameter default value (if scalar).
     *
     * @returns {*}
     */
    get scalarDefaultValue() {
        return this._scalarDefaultValue;
    }

    /**
     * Whether this parameter is an object pattern.
     *
     * @returns {boolean}
     */
    get isObjectPattern() {
        return this._objectPattern;
    }

    /**
     * Whether this parameter is an array pattern.
     *
     * @returns {boolean}
     */
    get isArrayPattern() {
        return this._arrayPattern;
    }

    /**
     * Whether this parameter is a rest element.
     *
     * @returns {boolean}
     */
    get isRestElement() {
        return this._restElement;
    }

    /**
     * Gets the metadata associated to this parameter.
     *
     * @returns {[Function, *][]}
     */
    get metadata() {
        const method = this._reflectionMethod;
        const class_ = method.reflectionClass;
        const metadata = class_.getConstructor()[Symbol.metadata];
        if (undefined === metadata) {
            return [];
        }

        const target = MetadataHelper.getMetadataTarget({ kind: 'parameter', index: this._index, name: this._name, metadata, function: { name: method.name } });
        const storage = MetadataStorage.getMetadata(target);

        return [ ...(function * () {
            for (const [ class_, data ] of storage) {
                for (const datum of isArray(data) ? data : [ data ]) {
                    yield [ class_, datum ];
                }
            }
        }()) ];
    }
}

module.exports = globalThis.ReflectionParameter = ReflectionParameter;
