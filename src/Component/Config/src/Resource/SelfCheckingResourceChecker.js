const ResourceCheckerInterface = Jymfony.Config.ResourceCheckerInterface;
const SelfCheckingResourceInterface = Jymfony.Config.Resource.SelfCheckingResourceInterface;

/**
 * @memberOf Jymfony.Config.Resource
 * @type {Jymfony.Config.Resource.SelfCheckingResourceChecker}
 */
module.exports = class SelfCheckingResourceChecker extends implementationOf(ResourceCheckerInterface) {
    /**
     * {@inheritDoc}
     */
    supports(metadata) {
        return metadata instanceof SelfCheckingResourceInterface;
    }

    /**
     * {@inheritDoc}
     */
    isFresh(resource, timestamp) {
        return resource.isFresh(timestamp);
    }
};
