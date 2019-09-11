declare namespace Jymfony.Component.Autoloader {
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
        loadClass(fn: string, self: any): any;

        /**
         * Loads a file and returns the file exports.
         */
        loadFile(fn: string, self: any, exports?: any): any;

        /**
         * Gets a file code.
         *
         * @param {string} fn
         *
         * @returns {{code: string, program: Jymfony.Component.Autoloader.Parser.AST.Program}}
         */
        getCode(fn);

        /**
         * Internal file loader.
         */
        private _doLoadFile(fn: string, self: any, exports: any): any;
    }
}
