const BaseNullMetadata = Jymfony.Contracts.Metadata.NullMetadata;
const PropertyMetadataInterface = Jymfony.Component.Validator.Mapping.PropertyMetadataInterface;

/**
 * @memberOf Jymfony.Component.Validator.Mapping
 */
export default class NullMetadata extends mix(BaseNullMetadata, PropertyMetadataInterface) {
    /**
     * @type {string}
     *
     * @private
     */
    _class;

    /**
     * @type {string}
     *
     * @private
     */
    _property;

    /**
     * @param {string} klass The name of the class this member is defined on
     * @param {string} name The name of the member
     * @param {string} property The property the member belongs to
     */
    __construct(klass, name, property) {
        super.__construct(name);
        this._class = klass;
        this._property = property;
    }

    /**
     * @inheritdoc
     */
    get className() {
        return this._class;
    }

    /**
     * @inheritdoc
     */
    get propertyName() {
        return this._property;
    }

    /**
     * @inheritdoc
     */
    getPropertyValue() {
        return undefined;
    }

    /**
     * @inheritdoc
     */
    findConstraints() {
        return [];
    }
}
