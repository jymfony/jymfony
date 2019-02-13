declare namespace Jymfony.Component.HttpFoundation.File.Exception {

    /**
     * Thrown when a file was not found.
     */
    class FileNotFoundException extends FileException {
        /**
         * Constructor.
         */
        __construct(path: string): void;
        constructor(path: string);
    }
}
