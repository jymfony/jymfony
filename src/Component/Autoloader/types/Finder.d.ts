declare namespace Jymfony.Component.Autoloader {
    export class Finder {
        private _require: NodeRequire;
        private _fs: any;
        private _path: any;
        private _root: string;

        /**
         * Constructor.
         */
        constructor(req?: NodeRequire, fs?: any, path?: any);

        /**
         * Searches for file/folder in base dir.
         */
        find(baseDir: string, name: string): any;

        /**
         * Loads a file.
         */
        load(fn: string): string;

        /**
         * Get application root dir, based on root module.
         */
        findRoot(): string|undefined;

        /**
         * Get module names list.
         * Note that this will return top-level modules ONLY.
         */
        listModules(): IterableIterator<string>|string[];

        private _getMainModule(): NodeModule;
        private _normalizePath(parts: string[], fileName: string): string;
    }
}
