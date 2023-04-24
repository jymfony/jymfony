declare namespace Jymfony.Component.Filesystem {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;

    interface MirrorOptions {
        override?: boolean;
        copy_on_windows?: boolean;
        delete?: boolean;
    }

    export class Filesystem {
        /**
         * Copies a file.
         *
         * If the target file is older than the origin file, it's always overwritten.
         * If the target file is newer, it is overwritten only when the overwriteNewerFiles option is set to true.
         *
         * @param originFile The original filename
         * @param targetFile The target filename
         * @param [overwriteNewerFiles = false] If true, target files newer than origin files are overwritten
         *
         * @throws {Jymfony.Component.Filesystem.Exception.IOException} When copy fails
         */
        copy(originFile: string, targetFile: string, overwriteNewerFiles?: boolean): Promise<void>;

        /**
         * Creates a directory recursively.
         *
         * @throws {Jymfony.Component.Filesystem.Exception.IOException} On any directory creation failure
         */
        mkdir(dirs: string | string[], mode?: number): Promise<void>;

        /**
         * Checks the existence of files or directories.
         *
         * @param files A filename, an array of files to check
         *
         * @returns true if the file exists, false otherwise
         */
        exists(files: string | string[]): Promise<boolean>;

        /**
         * Removes files or directories.
         *
         * @param files A filename, an array of files to remove
         *
         * @throws {Jymfony.Component.Filesystem.Exception.IOException} When removal fails
         */
        remove(files: string | string[]): Promise<void>;

        /**
         * Mirrors a directory to another.
         *
         * @param originDir The origin directory
         * @param targetDir The target directory
         * @param [options = {}] An array of boolean options
         *     Valid options are:
         *     - options['override'] Whether to override an existing file on copy or not (see copy())
         *     - options['copy_on_windows'] Whether to copy files instead of links on Windows (see symlink())
         *     - options['delete'] Whether to delete files that are not in the source directory (defaults to false)
         *
         * @throws {Jymfony.Component.Filesystem.Exception.IOException} When file type is unknown
         */
        mirror(originDir: string, targetDir: string, options?: MirrorOptions): Promise<void>;

        /**
         * Renames a file or a directory.
         *
         * @param origin The origin filename or directory
         * @param target The new filename or directory
         * @param [overwrite = false] Whether to overwrite the target if it already exists
         *
         * @throws {Jymfony.Component.Filesystem.Exception.IOException} When target file or directory already exists
         * @throws {Jymfony.Component.Filesystem.Exception.IOException} When origin cannot be renamed
         */
        rename(origin: string, target: string, overwrite?: boolean): Promise<void>;

        /**
         * Creates a symbolic link or copy a directory.
         *
         * @param originDir The origin directory path
         * @param targetDir The symbolic link name
         * @param [copyOnWindows = false] Whether to copy files if on Windows
         *
         * @throws {Jymfony.Component.Filesystem.Exception.IOException} When symlink fails
         */
        symlink(originDir: string, targetDir: string, copyOnWindows?: boolean): Promise<void>;

        /**
         * Resolves links in paths.
         *
         * With canonicalize = false (default)
         * - if path does not exist or is not a link, returns null
         * - if path is a link, returns the next direct target of the link without considering the existence of the target
         *
         * With canonicalize = true
         * - if path does not exist, returns null
         * - if path exists, returns its absolute fully resolved final version
         *
         * @param path A filesystem path
         * @param [canonicalize = false] Whether or not to return a canonicalized path
         */
        readlink(path: string, canonicalize?: boolean): Promise<string|null>;

        /**
         * Sets access and modification time of file.
         */
        touch(filename: string, time?: DateTimeInterface | null): Promise<void>;

        /**
         * Reads the contents of a directory.
         */
        readdir(path: string): Promise<string[]>;

        /**
         * Tells whether a file exists and is readable.
         *
         * @param filename Path to the file
         */
        isReadable(filename: string): Promise<boolean>;

        /**
         * Tells whether a file exists and is writable.
         *
         * @param filename Path to the file
         */
        isWritable(filename: string): Promise<boolean>;

        /**
         * Tells whether a file is a directory.
         *
         * @param path Path to the file
         */
        isDir(path: string): Promise<boolean>;

        /**
         * Tells whether a file is a file (not a directory or a device).
         *
         * @param path Path to the file
         */
        isFile(path: string): Promise<boolean>;

        /**
         * Tells whether a file is a symlink.
         *
         * @param path Path to the file
         */
        isLink(path: string): Promise<boolean>;
    }
}
