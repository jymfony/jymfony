declare namespace Jymfony.Component.Config.Exception {
    export class FileLoaderImportCircularReferenceException extends FileLoaderLoadException {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(resources: any[], code?: null|number, previous?: Error): void;
        constructor(resources: any[], code?: null|number, previous?: Error);
    }
}
