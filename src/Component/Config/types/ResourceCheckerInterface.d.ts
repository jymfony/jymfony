declare namespace Jymfony.Component.Config {
    import ResourceInterface = Jymfony.Component.Config.Resource.ResourceInterface;

    export class ResourceCheckerInterface implements MixinInterface {
        public static readonly definition: Newable<ResourceCheckerInterface>;

        /**
         * Queries the ResourceChecker whether it can validate a given
         * resource or not.
         *
         * @param metadata The resource to be checked for freshness
         *
         * @returns True if the ResourceChecker can handle this resource type, false if not
         */
        supports(metadata: ResourceInterface): boolean;

        /**
         * Validates the resource.
         *
         * @param resource The resource to be validated
         * @param timestamp The timestamp at which the cache associated with this resource was created
         *
         * @returns True if the resource has not changed since the given timestamp, false otherwise
         */
        isFresh(resource: ResourceInterface, timestamp: number): boolean;
    }
}
