const ResourceCheckerInterface = Jymfony.Component.Config.ResourceCheckerInterface;
const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;

/**
 * @memberOf Jymfony.Component.Config.Resource
 */
class SelfCheckingResourceChecker extends implementationOf(ResourceCheckerInterface) {
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
}

module.exports = SelfCheckingResourceChecker;
