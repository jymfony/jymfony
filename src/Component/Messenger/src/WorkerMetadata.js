/**
 * @memberOf Jymfony.Component.Messenger
 */
export default class WorkerMetadata {
    /**
     * Constructor.
     *
     * @param {Object.<string, *>} metadata
     */
    __construct(metadata) {
        this._metadata = metadata;
    }

    /**
     * @param {Object.<string, *>} newMetadata
     */
    set(newMetadata) {
        this._metadata = { ...this._metadata, ...newMetadata };
    }

    /**
     * Returns the queue names the worker consumes from, if "--queues" option was used.
     * Returns null otherwise.
     */
    get queueNames() {
        return this._metadata.queueNames || null;
    }

    /**
     * Returns an array of unique identifiers for transport receivers the worker consumes from.
     */
    get transportNames() {
        return this._metadata.transportNames || [];
    }
}
