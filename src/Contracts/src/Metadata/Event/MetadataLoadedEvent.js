const Event = Jymfony.Contracts.EventDispatcher.Event;

/**
 * @memberOf Jymfony.Contracts.Metadata.Event
 */
export default class MetadataLoadedEvent extends Event {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Metadata.MetadataInterface} metadata
     */
    __construct(metadata) {
        super.__construct();

        /**
         * @type {Jymfony.Contracts.Metadata.MetadataInterface}
         *
         * @private
         */
        this._metadata = metadata;
    }

    /**
     * Gets the metadata.
     *
     * @returns {Jymfony.Contracts.Metadata.MetadataInterface}
     */
    get metadata() {
        return this._metadata;
    }
}
