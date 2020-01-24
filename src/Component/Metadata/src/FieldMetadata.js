const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;
const MetadataPropertiesTrait = Jymfony.Component.Metadata.MetadataPropertiesTrait;

/**
 * Represents metadata for instance field.
 *
 * @memberOf Jymfony.Component.Metadata
 */
export default class FieldMetadata extends implementationOf(MetadataInterface, MetadataPropertiesTrait) {
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
         * @type {ReflectionField}
         *
         * @private
         */
        this._reflection = undefined;
    }

    __sleep() {
        const parent = super.__sleep();
        parent.push('_name');

        return parent;
    }

    /**
     * Gets the reflection field.
     *
     * @returns {ReflectionField}
     */
    get reflection() {
        if (undefined === this._reflection) {
            const reflectionClass = new ReflectionClass(this.className);
            this._reflection = new ReflectionField(reflectionClass, this.name);
        }

        return this._reflection;
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
