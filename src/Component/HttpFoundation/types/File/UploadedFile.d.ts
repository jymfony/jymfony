declare namespace Jymfony.Component.HttpFoundation.File {
    import DateTime = Jymfony.Component.DateTime.DateTime;

    export class UploadedFile extends File {
        private _buf: Buffer;
        private _originalName: string;
        private _mimeType: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(buf: Buffer, originalName:string, mimeType?: string): void;
        constructor(buf: Buffer, originalName:string, mimeType?: string);

        /**
         * @inheritdoc
         */
        public readonly content: NodeJS.ReadableStream;

        /**
         * Gets the original file name (from client).
         *
         * @returns {string}
         */
        public readonly originalName: string;

        /**
         * Gets the file size in bytes.
         *
         * @returns {int}
         */
        public readonly size: number;

        /**
         * Gets the file mime type as sent from the client.
         *
         * @returns {Promise<string>}
         */
        getMimeType(): Promise<string>;

        /**
         * @inheritdoc
         */
        public readonly isReadable: boolean;

        /**
         * @inheritdoc
         */
        public readonly modificationTime: DateTime;
    }
}
