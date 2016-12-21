const ResourceInterface = Jymfony.Config.Resource.ResourceInterface;

/**
 * @memberOf Jymfony.Config.Resource
 * @type {Jymfony.Config.Resource.SelfCheckingResourceInterface}
 */
class SelfCheckingResourceInterface extends ResourceInterface.definition {
    /**
     * Returns true if the resource has not been updated since the given timestamp.
     *
     * @param {int} timestamp The last time the resource was loaded
     *
     * @returns {boolean} True if the resource has not been updated, false otherwise
     */
    isFresh(timestamp) { }
}

module.exports = getInterface(SelfCheckingResourceInterface);
