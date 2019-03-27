declare namespace Jymfony.Component.Config {
    import ResourceInterface = Jymfony.Component.Config.Resource.ResourceInterface;

    export class ResourceCheckerConfigCache extends implementationOf(ConfigCacheInterface) {
        private _file: string;
        private _checkers: ResourceCheckerInterface[];

        /**
         * Create a config cache with resource checkers.
         */
        __construct(file: string, resourceCheckers?: ResourceCheckerInterface[]): void;
        constructor(file: string, resourceCheckers?: ResourceCheckerInterface[]);

        /**
         * @inheritdoc
         */
        getPath(): string;

        /**
         * @inheritdoc
         */
        isFresh(): boolean;

        /**
         * @inheritdoc
         */
        write(content: string, metadata?: ResourceInterface[]|undefined): void;

        private _getMetaFile(): string;
    }
}
