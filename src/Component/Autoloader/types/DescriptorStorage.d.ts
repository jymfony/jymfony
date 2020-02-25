declare namespace Jymfony.Component.Autoloader {
    import DecoratorDescriptor = Jymfony.Component.Autoloader.Parser.AST.DecoratorDescriptor;
    import Identifier = Jymfony.Component.Autoloader.Parser.AST.Identifier;

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
        register(descriptor: DecoratorDescriptor, alias?: Identifier): void;

        /**
         * Register decorators as exported by export * from ..
         */
        registerAllFrom(source: string): void;

        /**
         * Imports a decorator descriptor.
         */
        import(source: string, descriptorName: string): DecoratorDescriptor;
    }
}
