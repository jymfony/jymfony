declare namespace Jymfony.Component.Filesystem.StreamWrapper {
    /**
     * StreamWrapper registry.
     *
     * @final
     */
    export class StreamWrapper {
        private _wrappers: Record<string, StreamWrapperInterface>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Gets the appropriate stream wrapper for the given URL.
         *
         * @throws {Jymfony.Component.Filesystem.Exception.StreamWrapperNotAvailableException}
         */
        static get(path: string): StreamWrapperInterface;

        /**
         * Gets the appropriate stream wrapper for the given URL.
         *
         * @throws {Jymfony.Component.Filesystem.Exception.StreamWrapperNotAvailableException}
         */
        get(path: string): StreamWrapperInterface;

        /**
         * Registers a stream wrapper into the registry.
         */
        static register(wrapper: StreamWrapperInterface): void;

        /**
         * Registers a stream wrapper into the registry.
         */
        register(wrapper: StreamWrapperInterface): void;

        /**
         * Gets the singleton instance.
         */
        static getInstance(): StreamWrapper;
    }
}
