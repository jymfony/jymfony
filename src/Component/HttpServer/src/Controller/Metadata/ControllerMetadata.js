const ControllerArgumentMetadata = Jymfony.Component.HttpServer.Controller.Metadata.ControllerArgumentMetadata;
const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

/**
 * @memberOf Jymfony.Component.HttpServer.Controller.Metadata
 * @final
 */
export default class ControllerMetadata extends implementationOf(MetadataInterface) {
    /**
     * Constructor.
     *
     * @param {ReflectionMethod} reflectionMethod
     */
    __construct(reflectionMethod) {
        /**
         * @type {ReflectionMethod}
         *
         * @private
         */
        this._reflectionMethod = reflectionMethod;

        /**
         * @type {Jymfony.Component.HttpServer.Controller.Metadata.ControllerArgumentMetadata[]}
         *
         * @private
         */
        this._parameters = reflectionMethod.parameters.map(p => new ControllerArgumentMetadata(p));
        Object.freeze(this._parameters);
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
        const klass = this._reflectionMethod.reflectionClass.name;

        return klass + ':' + this._reflectionMethod.name;
    }

    /**
     * Gets the paramaters.
     *
     * @returns {Jymfony.Component.HttpServer.Controller.Metadata.ControllerArgumentMetadata[]}
     */
    get parameters() {
        return this._parameters;
    }

    /**
     * @inheritdoc
     */
    __sleep() {
        throw new Error('Cannot be serialized');
    }
}
