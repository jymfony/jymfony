declare namespace Jymfony.Component.Config.Resource {
    export class SelfCheckingResourceChecker extends implementationOf(ResourceCheckerInterface) {
        /**
         * @inheritdoc
         */
        supports(metadata: ResourceInterface): boolean;

        /**
         * @inheritdoc
         */
        isFresh(resource: ResourceInterface, timestamp: number): boolean;
    }
}
