const ResourceInterface = Jymfony.Component.Config.Resource.ResourceInterface;

/**
 * @memberOf Jymfony.Component.Config.Resource
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

export default getInterface(SelfCheckingResourceInterface);
