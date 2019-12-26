const MetadataPropertiesTrait = Jymfony.Component.Metadata.MetadataPropertiesTrait;
const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

/**
 * Represents metadata for method.
 *
 * @memberOf Jymfony.Component.Metadata
 */
export default class MethodMetadata extends implementationOf(MetadataInterface, MetadataPropertiesTrait) {
    /**
     * Constructor.
     *
     * @param {string} className
     * @param {string} name
     */
    __construct(className, name) {
        /**
         * @type {string}
         */
        this.className = className;

        /**
         * @type {string}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {ReflectionMethod}
         *
         * @private
         */
        this._reflectionMethod = undefined;
    }

    __sleep() {
        const parent = super.__sleep();
        parent.push('_name');

        return parent;
    }

    get reflection() {
        if (undefined === this._reflectionMethod) {
            this._reflectionMethod = new ReflectionMethod(new ReflectionClass(this.className), this.name);
        }

        return this._reflectionMethod;
    }

    /**
     * @inheritdoc
     */
    merge() {
    }

    /**
     * @inheritdoc
     */
    get name() {
        return this._name;
    }
}
