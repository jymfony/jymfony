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
        load(fn: string, self: ClassLoader): any;
    }
}
