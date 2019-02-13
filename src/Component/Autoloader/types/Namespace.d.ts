declare namespace Jymfony.Component.Autoloader {
    export class Namespace {
        private _autoloader: Autoloader;
        private _internalRequire: NodeRequire;
        private _fullyQualifiedName: string;
        private _classLoader: ClassLoader;
        private _target: any;
        private _baseDirs: Set<string>;

        /**
         * Constructor.
         */
        constructor(autoloader: Autoloader, fqn: string, baseDirs?: string|string[], req?: NodeRequire);

        /**
         * Add a base directory to search classes in
         */
        addDirectory(directory: string): this;

        /**
         * Get the namespace FQN
         */
        readonly name: string;

        /**
         * Gets the namespace base directories.
         */
        readonly directories: string[];
    }
}
