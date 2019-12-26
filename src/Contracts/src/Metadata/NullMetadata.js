const MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;

/**
 * Represents an undefined or empty metadata.
 *
 * @memberOf Jymfony.Contracts.Metadata
 */
export default class NullMetadata extends implementationOf(MetadataInterface) {
    /**
     * Constructor.
     *
     * @param {string} name
     */
    __construct(name) {
        /**
         * @type {string}
         *
         * @private
         */
        this._name = name;
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

    /**
     * @inheritdoc
     */
    __sleep() {
        return [];
    }
}
