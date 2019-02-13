declare namespace Jymfony.Component.Config.Exception {
    /**
     * Exception class for when a resource cannot be loaded or imported.
     */
    export class FileLoaderLoadException extends global.Exception {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(resource: any, sourceResource?: any, code?: null|number, previous?: Error, type?: string): void;
        constructor(resource: any, sourceResource?: any, code?: null|number, previous?: Error, type?: string);

        static varToString(variable: any): string;
    }
}
