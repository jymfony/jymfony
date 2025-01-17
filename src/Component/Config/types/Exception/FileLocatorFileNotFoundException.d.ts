declare namespace Jymfony.Component.Config.Exception {
    /**
     * File locator exception if a file does not exist.
     */
    export class FileLocatorFileNotFoundException extends global.InvalidArgumentException {
        public readonly paths: string[];

        __construct(message?: string, code?: null | number, previous?: undefined | Error, paths?: string[]): void;
        constructor(message?: string, code?: null | number, previous?: undefined | Error, paths?: string[]);
    }
}
