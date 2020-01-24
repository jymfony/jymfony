const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;
const MetadataPropertiesTrait = Jymfony.Component.Metadata.MetadataPropertiesTrait;

/**
 * Represents metadata for getter/setter.
 *
 * @memberOf Jymfony.Component.Metadata
 */
export default class PropertyMetadata extends implementationOf(MetadataInterface, MetadataPropertiesTrait) {
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
         * @type {[ReflectionProperty, ReflectionProperty]}
         *
         * @private
         */
        this._reflection = undefined;
    }

    /**
     * Gets the reflection property.
     *
     * @returns {[ReflectionProperty, ReflectionProperty]}
     */
    get reflection() {
        if (undefined === this._reflection) {
            const reflectionClass = new ReflectionClass(this.className);
            const readable = reflectionClass.hasReadableProperty(this._name) ? reflectionClass.getReadableProperty(this._name) : null;
            const writable = reflectionClass.hasWritableProperty(this._name) ? reflectionClass.getWritableProperty(this._name) : null;
            this._reflection = [ readable, writable ];
        }

        return this._reflection;
    }

    __sleep() {
        const parent = super.__sleep();
        parent.push('_name');

        return parent;
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
