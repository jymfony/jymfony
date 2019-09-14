declare namespace Jymfony.Component.Config.Resource {
    /**
     * DirectoryResource represents a resources stored in a subdirectory tree.
     */
    export class DirectoryResource extends implementationOf(SelfCheckingResourceInterface) {
        private _resource: boolean;
        private _pattern: null | RegExp;

        /**
         * The file path to the resource
         */
        public readonly resource: string;

        /**
         * The pattern to restrict monitored files.
         */
        public readonly pattern: string | null;

        /**
         * Constructor.
         *
         * @param resource The file path to the resource
         * @param [pattern] A pattern to restrict monitored files
         */
        __construct(resource: string, pattern?: null|RegExp): void;
        constructor(resource: string, pattern?: null|RegExp);

        /**
         * @inheritdoc
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        isFresh(timestamp: number): boolean;
    }
}
