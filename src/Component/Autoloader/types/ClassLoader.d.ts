declare namespace Jymfony.Component.Autoloader {
    type Code = { code: string, program: unknown };

    export class ClassLoader {
        private _finder: Finder;
        private _path: any;
        private _vm: any;
        private _cache: any;

        /**
         * Constructor.
         */
        constructor(finder: Finder, path: any, vm: any);

        /**
         * Clears the code/compiler cache.
         */
        static clearCache(): void;

        /**
         * Loads a class.
         */
        loadClass(fn: string): any;

        /**
         * Loads a file and returns the file exports.
         */
        loadFile(fn: string, exports?: any): any;

        /**
         * Gets a file code.
         */
        getCode(fn: string, namespace?: string): Code;

        /**
         * Loads and transpile typescript file.
         *
         * @param fn The filename to load.
         */
        private _doLoadTypescript(fn: string): any;

        /**
         * Internal file loader.
         */
        private _doLoadFile(fn: string, exports: any): any;
    }
}
