declare namespace Jymfony.Component.Autoloader {
    export class Autoloader {
        public readonly classLoader: ClassLoader;

        /**
         * Debug flag.
         * If true, the autoloader will throw ClassNotFoundException if
         * the class (or a namespace) does not exist.
         */
        public debug: boolean;
        public readonly finder: Finder;
        public readonly rootDir: string;

        private _classLoader: ClassLoader;
        private _debug: boolean;
        private _finder: Finder;
        private _global: any;
        private _registered: boolean;
        private _rootDir: string;

        /**
         * Constructor.
         */
        constructor(finder?: Finder, globalObject?: NodeJS.Global);

        /**
         * Scans package.json of the project and root dependencies
         * and register itself as autoloader for found namespaces
         */
        register(): void;

        private _processPackageInfo(packageInfo: any, baseDir: string): void;
        private _processNamespaces(config: any, baseDir: string): void;
        private _processIncludes(config: any, baseDir: string): void;
        private _ensureNamespace(namespace: string, parent: any): Namespace;
        private _generateFqn(parent: any, namespace: string): string;
    }
}
