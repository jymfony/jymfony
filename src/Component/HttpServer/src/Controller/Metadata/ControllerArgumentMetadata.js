const ReflectionHelper = Jymfony.Component.Autoloader.Reflection.ReflectionHelper;
const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

/**
 * @memberOf Jymfony.Component.HttpServer.Controller.Metadata
 * @final
 */
export default class ControllerArgumentMetadata extends implementationOf(MetadataInterface) {
    /**
     * @type {ReflectionParameter}
     *
     * @private
     */
    _reflectionParameter;

    /**
     * @type {*}
     *
     * @private
     */
    _type;

    /**
     * @type {boolean}
     *
     * @private
     */
    _hasDefaultValue;

    /**
     * @type {boolean}
     *
     * @private
     */
    _isRestElement;

    /**
     * Constructor.
     *
     * @param {ReflectionParameter} reflectionParameter
     */
    __construct(reflectionParameter) {
        this._reflectionParameter = reflectionParameter;
        this._type = ReflectionHelper.getParameterType(reflectionParameter);
        this._hasDefaultValue = reflectionParameter.hasDefaultValue;
        this._isRestElement = reflectionParameter.isRestElement;
    }

    /**
     * Gets the reflection parameter.
     *
     * @returns {ReflectionParameter}
     */
    get reflection() {
        return this._reflectionParameter;
    }

    /**
     * Gets the parameter type.
     *
     * @returns {*}
     */
    get type() {
        return this._type;
    }

    /**
     * @inheritdoc
     */
    merge() {
        // Do nothing.
    }

    /**
     * @inheritdoc
     */
    get name() {
        return this._reflectionParameter.name;
    }

    /**
     * Gets the parameter default value (if any).
     *
     * @returns {boolean}
     */
    get hasDefaultValue() {
        return this._hasDefaultValue;
    }

    /**
     * Whether the argument is a rest element.
     *
     * @returns {boolean}
     */
    get isRestElement() {
        return this._isRestElement;
    }

    /**
     * @inheritdoc
     */
    __sleep() {
        throw new Error('Cannot be serialized');
    }
}
