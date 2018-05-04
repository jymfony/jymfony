/**
 * @memberOf Jymfony.Component.Config
 */
class ResourceCheckerInterface {
    /**
     * Queries the ResourceChecker whether it can validate a given
     * resource or not.
     *
     * @param {Jymfony.Component.Config.Resource.ResourceInterface} metadata The resource to be checked for freshness
     *
     * @returns {boolean} True if the ResourceChecker can handle this resource type, false if not
     */
    supports(metadata) { }

    /**
     * Validates the resource.
     *
     * @param {Jymfony.Component.Config.Resource.ResourceInterface} resource  The resource to be validated
     * @param {int} timestamp The timestamp at which the cache associated with this resource was created
     *
     * @returns {boolean} True if the resource has not changed since the given timestamp, false otherwise
     */
    isFresh(resource, timestamp) { }
}

module.exports = getInterface(ResourceCheckerInterface);
