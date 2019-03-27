declare namespace Jymfony.Component.Cache.Adapter {
    import FilesystemTrait = Jymfony.Component.Cache.Traits.FilesystemTrait;

    export class FilesystemAdapter extends mix(AbstractAdapter, FilesystemTrait) {
        /**
         * Constructor.
         */
        __construct(namespace?: string, defaultLifetime?: number, directory?: string): void;
        constructor(namespace?: string, defaultLifetime?: number, directory?: string);
    }
}
