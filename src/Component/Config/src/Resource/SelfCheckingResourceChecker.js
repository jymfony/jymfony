const ResourceCheckerInterface = Jymfony.Component.Config.ResourceCheckerInterface;
const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;

/**
 * @memberOf Jymfony.Component.Config.Resource
 */
export default class SelfCheckingResourceChecker extends implementationOf(ResourceCheckerInterface) {
    /**
     * @inheritdoc
     */
    supports(metadata) {
        return metadata instanceof SelfCheckingResourceInterface;
    }

    /**
     * @inheritdoc
     */
    isFresh(resource, timestamp) {
        return resource.isFresh(timestamp);
    }
}
