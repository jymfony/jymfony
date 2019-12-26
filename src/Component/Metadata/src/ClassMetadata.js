const ClassMetadataInterface = Jymfony.Component.Metadata.ClassMetadataInterface;
const InvalidArgumentException = Jymfony.Contracts.Metadata.Exception.InvalidArgumentException;
const MetadataPropertiesTrait = Jymfony.Component.Metadata.MetadataPropertiesTrait;
const NullMetadata = Jymfony.Contracts.Metadata.NullMetadata;

/**
 * @memberOf Jymfony.Component.Metadata
 */
export default class ClassMetadata extends implementationOf(ClassMetadataInterface, MetadataPropertiesTrait) {
    /**
     * Constructor.
     *
     * @param {ReflectionClass} reflectionClass
     */
    __construct(reflectionClass) {
        /**
         * @type {ReflectionClass}
         *
         * @private
         */
        this._reflectionClass = reflectionClass;

        /**
         * @type {string}
         *
         * @private
         */
        this._name = reflectionClass.name;

        /**
         * @type {Object.<string, Jymfony.Contracts.Metadata.MetadataInterface>}
         */
        this._attributesMetadata = {};

        /**
         * @type {Map<string, string>}
         *
         * @private
         */
        this._attributesNames = new Map();
    }

    __sleep() {
        const parent = super.__sleep();
        parent.push('_name', '_attributesMetadata');

        return parent;
    }

    __wakeup() {
        this._attributesNames = new Map();
        for (const [ key ] of __jymfony.getEntries(this.attributesMetadata)) {
            this._attributesNames.set(key.toLowerCase(), key);
        }

        this._reflectionClass = undefined;
    }

    /**
     * @inheritdoc
     */
    get reflectionClass() {
        if (undefined === this._reflectionClass) {
            this._reflectionClass = new ReflectionClass(this._name);
        }

        return this._reflectionClass;
    }

    /**
     * @inheritdoc
     */
    merge(metadata) {
        if (metadata instanceof NullMetadata) {
            return;
        }

        if (! (metadata instanceof ClassMetadataInterface)) {
            throw InvalidArgumentException.create(InvalidArgumentException.NOT_MERGEABLE_METADATA, this, metadata);
        }

        if (! this.reflectionClass.isSubclassOf(metadata.reflectionClass.getConstructor())) {
            throw InvalidArgumentException.create(
                InvalidArgumentException.NOT_MERGEABLE_METADATA,
                this.reflectionClass.name,
                metadata.reflectionClass.name
            );
        }

        const otherAttributes = metadata.attributesMetadata;
        for (const [ attrName, attrMetadata ] of __jymfony.getEntries(otherAttributes)) {
            const target = this.getAttributeMetadata(attrName);
            if (target instanceof NullMetadata) {
                this._attributesMetadata[attrName] = attrMetadata;
                this._attributesNames.set(attrName.toLowerCase(), attrName);
                continue;
            }

            target.merge(attrMetadata);
        }
    }

    /**
     * @inheritdoc
     */
    getAttributeMetadata(name) {
        name = name.toLowerCase();
        if (! this._attributesNames.has(name)) {
            return new NullMetadata(name);
        }

        name = this._attributesNames.get(name);

        return this._attributesMetadata[name];
    }

    /**
     * @inheritdoc
     */
    addAttributeMetadata(metadata) {
        const name = metadata.name;

        this._attributesMetadata[name] = metadata;
        this._attributesNames.set(name.toLowerCase(), name);
    }

    /**
     * @inheritdoc
     */
    get name() {
        return this.reflectionClass.name;
    }

    /**
     * @inheritdoc
     */
    get attributesMetadata() {
        return { ...this._attributesMetadata };
    }
}
