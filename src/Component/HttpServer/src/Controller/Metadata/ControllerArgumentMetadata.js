const ReflectionHelper = Jymfony.Component.Autoloader.Reflection.ReflectionHelper;
const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

/**
 * @memberOf Jymfony.Component.HttpServer.Controller.Metadata
 * @final
 */
export default class ControllerArgumentMetadata extends implementationOf(MetadataInterface) {
    /**
     * Constructor.
     *
     * @param {ReflectionParameter} reflectionParameter
     */
    __construct(reflectionParameter) {
        /**
         * @type {ReflectionParameter}
         *
         * @private
         */
        this._reflectionParameter = reflectionParameter;

        /**
         * @type {*}
         *
         * @private
         */
        this._type = ReflectionHelper.getParameterType(reflectionParameter);

        /**
         * @type {*}
         *
         * @private
         */
        this._defaultValue = reflectionParameter.defaultValue;

        /**
         * @type {boolean}
         *
         * @private
         */
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
     * @returns {*}
     */
    get defaultValue() {
        return this._defaultValue;
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
