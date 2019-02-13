declare namespace Jymfony.Component.HttpFoundation {
    import File = Jymfony.Component.HttpFoundation.File.File;

    /**
     * Represents an HTTP response delivering a file.
     */
    export class BinaryFileResponse extends Response {
        protected _file: File;
        private _autoEtag: boolean;
        private _autoLastModified: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(file: File | string, status?: number, headers?: Record<string, string | string[]>, isPublic?: boolean, contentDisposition?: string | null, autoEtag?: boolean, autoLastModified?: boolean): void;
        constructor(file: File | string, status?: number, headers?: Record<string, string | string[]>, isPublic?: boolean, contentDisposition?: string | null, autoEtag?: boolean, autoLastModified?: boolean);

        /**
         * @inheritdoc
         */
        prepare(request: Request): Promise<this>;

        /**
         * Sets the file to stream.
         *
         * @throws {Jymfony.Component.HttpFoundation.File.Exception.FileException}
         */
        setFile(file: File | string, contentDisposition?: string | number, autoEtag?: boolean, autoLastModified?: boolean): this;

        /**
         * Automatically sets the ETag header according to the checksum of the file.
         */
        setAutoEtag(): this;

        /**
         * Automatically sets the Last-Modified header according the file modification date.
         */
        setAutoLastModified(): this;

        /**
         * Sets the Content-Disposition header with the given filename.
         *
         * @param disposition ResponseHeaderBag.DISPOSITION_INLINE or ResponseHeaderBag.DISPOSITION_ATTACHMENT
         * @param filename Optionally use this UTF-8 encoded filename instead of the real name of the file
         * @param filenameFallback A fallback filename, containing only ASCII characters. Defaults to an automatically encoded filename
         */
        setContentDisposition(disposition: string, filename?: string, filenameFallback?: string): this;
    }
}
