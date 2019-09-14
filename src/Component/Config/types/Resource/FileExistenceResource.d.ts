declare namespace Jymfony.Component.Config.Resource {
    /**
     * FileExistenceResource represents a resource stored on the filesystem.
     * Freshness is only evaluated against resource creation or deletion.
     *
     * The resource can be a file or a directory.
     */
    export class FileExistenceResource extends implementationOf(SelfCheckingResourceInterface) {
        private _resource: string;
        private _exists: boolean;

        /**
         * The file path to the resource
         */
        public readonly resource: string;

        /**
         * @param resource The file path to the resource
         */
        __construct(resource: string): void;
        constructor(resource: string);

        /**
         * @inheritdoc
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        isFresh(): boolean;
    }
}
