declare namespace Jymfony.Component.HttpFoundation.File {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;

    export class File {
        private _fileName: string;
        private _stat: any;

        /**
         * Constructor.
         */
        __construct(path: string, checkPath?: boolean): void;
        constructor(path: string, checkPath?: boolean);

        /**
         * Gets the file mime type as sent from the client.
         */
        getMimeType(): Promise<string>;

        /**
         * Gets the filename.
         */
        public readonly fileName: string;

        /**
         * Gets the file size in bytes.
         */
        public readonly size: number;

        /**
         * Tells if a file exists.
         */
        exists(): boolean;

        /**
         * Tells if file is readable
         */
        public readonly isReadable: boolean;

        /**
         * Gets the file content.
         */
        public readonly content: NodeJS.ReadableStream;

        /**
         * Gets the last modification time.
         */
        public readonly modificationTime: DateTimeInterface;
    }
}
