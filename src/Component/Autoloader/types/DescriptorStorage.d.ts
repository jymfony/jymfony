declare namespace Jymfony.Component.Autoloader {
    type Storage = {};

    class DescriptorStorage {
        private _classLoader: ClassLoader;
        private _filename: string;
        private _storage: Storage;

        /**
         * Constructor.
         */
        constructor(classLoader: ClassLoader, filename?: string, storage?: Storage);

        /**
         * Sets a new file to be processed.
         */
        setFile(filename: string): DescriptorStorage;

        /**
         * Registers a decorator descriptor.
         */
        register(descriptor: any, alias?: any): void;

        /**
         * Register decorators as exported by export * from ..
         */
        registerAllFrom(source: string): void;

        /**
         * Imports a decorator descriptor.
         */
        import(source: string, descriptorName: string): any;
    }
}
