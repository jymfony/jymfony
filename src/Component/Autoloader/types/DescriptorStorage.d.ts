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
         *
         * @param {Jymfony.Component.Autoloader.Parser.AST.DecoratorDescriptor} descriptor
         * @param {Jymfony.Component.Autoloader.Parser.AST.Identifier} alias
         */
        register(descriptor, alias = descriptor.name) {
            const name = alias.name;
            this._storage[this._filename + name] = descriptor;
        }

        /**
         * Register decorators as exported by export * from ..
         *
         * @param {string} source
         */
        registerAllFrom(source) {
            try {
                source = require.resolve(source, { paths: [dirname(this._filename)] });
            } catch (e) {
                return;
            }

            this._classLoader.getCode(source);

            for (const [name, descriptor] of __jymfony.getEntries(this._storage)) {
                if (name.startsWith(source + '@')) {
                    this._storage[name.replace(new RegExp('^' + __jymfony.regex_quote(source)), this._filename)] = descriptor;
                }
            }
        }

        /**
         * Imports a decorator descriptor.
         *
         * @param {string} source
         * @param {string} descriptorName
         *
         * @returns {Jymfony.Component.Autoloader.Parser.AST.DecoratorDescriptor}
         */
        import(source, descriptorName) {
            source = require.resolve(source, { paths: [dirname(this._filename)] });
            this._classLoader.getCode(source);

            return this._storage[source + descriptorName];
        }
    }
}
