declare namespace Jymfony.Component.Filesystem {
    import DateTime = Jymfony.Component.DateTime.DateTime;
    import StreamWrapperInterface = Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface;

    /**
     * Represents a file.
     */
    export class File {
        /**
         * Seek from the beginning of the file.
         */
        public static readonly SEEK_SET = 'set';

        /**
         * Seek from the current position of the file.
         */
        public static readonly SEEK_CUR = 'cur';

        /**
         * Seek from the end of the file.
         */
        public static readonly SEEK_END = 'end';

        private _url: any;

        protected _streamWrapper: StreamWrapperInterface;

        /**
         * Constructor.
         *
         * @param fileName The file path or the complete url.
         *                 The file does not need to exist or to be readable.
         */
        __construct(fileName: string): void;
        constructor(fileName: string);

        /**
         * Gets the file access time.
         */
        getAtime(): Promise<DateTime>;

        /**
         * Gets the file inode change time.
         */
        getCtime(): Promise<DateTime>;

        /**
         * Gets the file modification time.
         */
        getMtime(): Promise<DateTime>;

        /**
         * Gets the file creation time.
         */
        getBirthtime(): Promise<DateTime>;

        /**
         * The file name.
         */
        public filename: string;

        /**
         * The path name.
         */
        public path: string;

        /**
         * Gets the base name of the file, without the path.
         */
        getBasename(extension?: string|undefined): string;

        /**
         * Gets the file's permissions.
         */
        getPerms(): Promise<number>;

        /**
         * Gets the file's realpath.
         */
        getRealpath(): Promise<string>;

        /**
         * Gets the file's size.
         */
        getSize(): Promise<number>;

        /**
         * Opens the file with the given file mode.
         */
        openFile(mode?: string): Promise<OpenFile>;

        /**
         * Whether the current file represents a directory.
         */
        isDirectory(): Promise<boolean>;

        /**
         * Whether the current file is a file.
         */
        isFile(): Promise<boolean>;

        /**
         * Whether the current file is a block device.
         */
        isBlockDevice(): Promise<boolean>;

        /**
         * Whether the current file is a character device.
         */
        isCharacterDevice(): Promise<boolean>;

        /**
         * Whether the current file is a symbolic link.
         */
        isSymbolicLink(): Promise<boolean>;

        /**
         * Whether the current file is a FIFO.
         */
        isFIFO(): Promise<boolean>;

        /**
         * Whether the current file is a unix socket file.
         */
        isSocket(): Promise<boolean>;

        /**
         * Unlinks the current file.
         */
        unlink(): Promise<void>;

        /**
         * Returns the path to the file as a string.
         */
        toString(): string;

        /**
         * Resolves a file path and returns the correspondent Url object.
         */
        static resolve(fileName: string): any;

        /**
         * Gets the file stat.
         */
        private _stat(stat_link?: boolean): Promise<any|boolean>;
    }
}
