const IOException = Jymfony.Component.Filesystem.Exception.IOException;
const UnsupportedOperationException = Jymfony.Component.Filesystem.Exception.UnsupportedOperationException;
const RecursiveDirectoryIterator = Jymfony.Component.Filesystem.Iterator.RecursiveDirectoryIterator;
const StreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.StreamWrapper;
const StreamWrapperInterface = Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface;

const S_IRUSR = 0o0400; // Owner has read permission
const S_IWUSR = 0o0200; // Owner has write permission
const S_IRGRP = 0o0040; // Group has read permission
const S_IWGRP = 0o0020; // Group has write permission
const S_IROTH = 0o0004; // Others have read permission
const S_IWOTH = 0o0002; // Others have write permission

/**
 * @memberOf Jymfony.Component.Filesystem
 */
class Filesystem {
    /**
     * Copies a file.
     *
     * If the target file is older than the origin file, it's always overwritten.
     * If the target file is newer, it is overwritten only when the overwriteNewerFiles option is set to true.
     *
     * @param {string} originFile The original filename
     * @param {string} targetFile The target filename
     * @param {boolean} [overwriteNewerFiles = false] If true, target files newer than origin files are overwritten
     *
     * @returns {Promise<void>}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When copy fails
     */
    async copy(originFile, targetFile, overwriteNewerFiles = false) {
        const originWrapper = StreamWrapper.get(originFile);
        const targetWrapper = StreamWrapper.get(targetFile);

        let doCopy = true;
        let fileMode = 0o666;

        try {
            await this.mkdir(targetFile.split(/[\\\/]/g).slice(0, -1).join('/'));
        } catch (e) {
            if (! (e instanceof UnsupportedOperationException)) {
                throw e;
            }
        }

        let originStat;
        try {
            originStat = await originWrapper.stat(originFile);

            if (!overwriteNewerFiles && (await this.isFile(targetFile))) {
                const targetStat = await targetWrapper.stat(targetFile);
                doCopy = (originStat.mtime || 0) > (targetStat.mtime || Date.now());
            }

            fileMode = originStat.mode & 0o777;
        } catch (e) {
            if (! (e instanceof UnsupportedOperationException)) {
                throw e;
            }
        }

        if (doCopy) {
            const origin = await originWrapper.streamOpen(originFile, 'r');
            const target = await targetWrapper.streamOpen(targetFile, 'w');

            const rs = originWrapper.createReadableStream(origin);
            const ws = targetWrapper.createWritableStream(target);

            try {
                await new Promise((resolve, reject) => {
                    rs.on('error', err => reject(err));
                    ws.on('error', err => reject(err));

                    ws.on('finish', resolve);
                    rs.pipe(ws);
                });
            } finally {
                rs.destroy();
                ws.end();
            }

            if (! (await this.isFile(targetFile))) {
                throw new IOException(__jymfony.sprintf('Failed to copy "%s" to "%s".', originFile, targetFile), null, undefined, originFile);
            }

            await targetWrapper.metadata(targetFile, StreamWrapperInterface.META_ACCESS, fileMode);

            try {
                const targetStat = await targetWrapper.stat(targetFile);

                if (originStat && undefined !== originStat.size && targetStat.size !== originStat.size) {
                    throw new IOException(__jymfony.sprintf('Failed to copy the whole content of "%s" to "%s" (%g of %g bytes copied).', originFile, targetFile, targetStat.size, originStat.size), null, undefined, originFile);
                }
            } catch (e) {
                if (! (e instanceof UnsupportedOperationException)) {
                    throw e;
                }
            }
        }
    }

    /**
     * Creates a directory recursively.
     *
     * @param {string|string[]} dirs The directory path
     * @param {int} [mode = 0o777] The directory mode
     *
     * @returns {Promise<void>}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} On any directory creation failure
     */
    async mkdir(dirs, mode = 0o777) {
        if (! isArray(dirs)) {
            dirs = [ dirs ];
        }

        for (const dir of dirs) {
            if (await this.isDir(dir)) {
                continue;
            }

            try {
                await StreamWrapper.get(dir).mkdir(dir, mode, true);
            } catch (err) {
                if (! (await this.isDir(dir))) {
                    // The directory was not created by a concurrent process. Let's throw an exception with a developer friendly error message if we have one
                    throw new IOException(__jymfony.sprintf('Failed to create "%s": %s.', dir, err.message), null, err, dir);
                }
            }
        }
    }

    /**
     * Checks the existence of files or directories.
     *
     * @param {string|string[]} files A filename, an array of files to check
     *
     * @returns {Promise<boolean>} true if the file exists, false otherwise
     */
    async exists(files) {
        if (! isArray(files)) {
            files = [ files ];
        }

        for (const file of files) {
            if (false === (await StreamWrapper.get(file).stat(file))) {
                return false;
            }
        }

        return true;
    }

    /**
     * Removes files or directories.
     *
     * @param {string|string[]} files A filename, an array of files to remove
     *
     * @returns {Promise<void>}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When removal fails
     */
    async remove(files) {
        if (! isArray(files)) {
            files = [ files ];
        }

        for (const file of files.reverse()) {
            if (await this.isDir(file)) {
                await this.remove((await this.readdir(file)).map(f => file + '/' + f));

                try {
                    await StreamWrapper.get(file).rmdir(file);
                } catch (err) {
                    throw new IOException(__jymfony.sprintf('Failed to remove directory "%s": %s.', file, err.message));
                }
            } else {
                try {
                    await StreamWrapper.get(file).unlink(file);
                } catch (err) {
                    throw new IOException(__jymfony.sprintf('Failed to remove file "%s": %s.', file, err.message));
                }
            }
        }
    }

    /**
     * Mirrors a directory to another.
     *
     * @param {string} originDir The origin directory
     * @param {string} targetDir The target directory
     * @param {Object} [options = {}] An array of boolean options
     *     Valid options are:
     *     - options['override'] Whether to override an existing file on copy or not (see copy())
     *     - options['copy_on_windows'] Whether to copy files instead of links on Windows (see symlink())
     *     - options['delete'] Whether to delete files that are not in the source directory (defaults to false)
     *
     * @returns {Promise<void>}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When file type is unknown
     */
    async mirror(originDir, targetDir, options = {}) {
        targetDir = __jymfony.rtrim(targetDir, '/\\\\');
        originDir = __jymfony.rtrim(originDir, '/\\\\');

        // Iterate in destination folder to remove obsolete entries
        if ((await this.exists(targetDir)) && options['delete']) {
            const deleteIterator = new RecursiveDirectoryIterator(targetDir, RecursiveDirectoryIterator.CHILD_FIRST);
            await __jymfony.forAwait(deleteIterator, async file => {
                const origin = file.replace(targetDir, originDir);
                if (! (await this.exists(origin))) {
                    await this.remove(file);
                }
            });
        }

        const copyOnWindows = __jymfony.Platform.isWindows() && !! options.copy_on_windows;
        const flags = copyOnWindows ? RecursiveDirectoryIterator.FOLLOW_SYMLINKS : 0;
        const iterator = new RecursiveDirectoryIterator(originDir, flags | RecursiveDirectoryIterator.CHILD_LAST);

        if (! (await this.exists(targetDir))) {
            await this.mkdir(targetDir);
        }

        const originWrapper = StreamWrapper.get(originDir);
        await __jymfony.forAwait(iterator, async file => {
            const target = file.replace(originDir, targetDir);
            const stat = await originWrapper.stat(file, {
                stat_link: ! copyOnWindows,
            });

            if (copyOnWindows) {
                if (stat.isFile()) {
                    await this.copy(file, target, !! options.override);
                } else if (stat.isDirectory()) {
                    await this.mkdir(target);
                } else {
                    await new IOException(__jymfony.sprintf('Unable to guess "%s" file type.', file), null, undefined, file);
                }
            } else {
                if (stat.isSymbolicLink()) {
                    await this.symlink(await this.readlink(file), target);
                } else if (stat.isDirectory()) {
                    await this.mkdir(target);
                } else if (stat.isFile()) {
                    await this.copy(file, target, !! options.override);
                } else {
                    throw new IOException(__jymfony.sprintf('Unable to guess "%s" file type.', file), null, undefined, file);
                }
            }
        });
    }

    /**
     * Renames a file or a directory.
     *
     * @param {string} origin The origin filename or directory
     * @param {string} target The new filename or directory
     * @param {boolean} [overwrite = false] Whether to overwrite the target if it already exists
     *
     * @returns {Promise<void>}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When target file or directory already exists
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When origin cannot be renamed
     */
    async rename(origin, target, overwrite = false) {
        // We check that target does not exist
        if (! overwrite && (await this.isReadable(target))) {
            throw new IOException(__jymfony.sprintf('Cannot rename because the target "%s" already exists.', target), null, undefined, target);
        }

        const originWrapper = StreamWrapper.get(origin);
        const targetWrapper = StreamWrapper.get(target);

        if (originWrapper === targetWrapper) {
            try {
                await originWrapper.rename(origin, target);
            } catch (err) {
                if (! (await this.isDir(origin))) {
                    throw new IOException(__jymfony.sprintf('Cannot rename "%s" to "%s".', origin, target), null, undefined, target);
                }

                await this.mirror(origin, target, { override: overwrite, 'delete': overwrite });
                await this.remove(origin);
            }
        } else {
            await this.copy(origin, target);
            try {
                await originWrapper.unlink(origin);
            } catch (e) {
                if (! (e instanceof UnsupportedOperationException)) {
                    throw e;
                }
            }
        }
    }

    /**
     * Creates a symbolic link or copy a directory.
     *
     * @param {string} originDir The origin directory path
     * @param {string} targetDir The symbolic link name
     * @param {boolean} [copyOnWindows = false] Whether to copy files if on Windows
     *
     * @returns {Promise<void>}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When symlink fails
     */
    async symlink(originDir, targetDir, copyOnWindows = false) {
        const targetWrapper = StreamWrapper.get(targetDir);
        const sourceWrapper = StreamWrapper.get(originDir);

        if (targetWrapper !== sourceWrapper) {
            throw new UnsupportedOperationException('Symlink between two different protocols is not supported');
        }

        if ('file' === targetWrapper.protocol && __jymfony.Platform.isWindows()) {
            originDir = originDir.replace('/', '\\');
            targetDir = targetDir.replace('/', '\\');

            if (copyOnWindows) {
                await this.mirror(originDir, targetDir);
                return;
            }
        }

        await this.mkdir(targetDir.split(/[\\\/]/g).slice(0, -1).join('/'));

        if (await this.isLink(targetDir) && await this.readlink(targetDir) !== originDir) {
            await this.remove(targetDir);
        }

        await targetWrapper.symlink(originDir, targetDir);
    }

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
     * @param {string} path A filesystem path
     * @param {boolean} [canonicalize = false] Whether or not to return a canonicalized path
     *
     * @returns {Promise<string|null>}
     */
    async readlink(path, canonicalize = false) {
        const streamWrapper = StreamWrapper.get(path);
        if (! canonicalize && ! (await this.isLink(path))) {
            return null;
        }

        if (canonicalize) {
            if (! (await this.exists(path))) {
                return null;
            }

            if (__jymfony.Platform.isWindows()) {
                path = await streamWrapper.readlink(path);
            }

            return await streamWrapper.realpath(path);
        }

        if (__jymfony.Platform.isWindows()) {
            return await streamWrapper.realpath(path);
        }

        return await streamWrapper.readlink(path);
    }

    /**
     * Reads the contents of a directory.
     *
     * @param path
     *
     * @returns {Promise<string[]>}
     */
    async readdir(path) {
        return await StreamWrapper.get(path).readdir(path);
    }

    /**
     * Tells whether a file exists and is readable.
     *
     * @param {string} filename Path to the file
     *
     * @returns {Promise<boolean>}
     */
    async isReadable(filename) {
        const stat = await StreamWrapper.get(filename).stat(filename);

        if (process.getuid() === stat.uid) {
            return (stat.mode & S_IRUSR) === S_IRUSR;
        } else if (process.getgid() === stat.gid) {
            return (stat.mode & S_IRGRP) === S_IRGRP;
        }

        return (stat.mode & S_IROTH) === S_IROTH;
    }

    /**
     * Tells whether a file exists and is writable.
     *
     * @param {string} filename Path to the file
     *
     * @returns {Promise<boolean>}
     */
    async isWritable(filename) {
        const stat = await StreamWrapper.get(filename).stat(filename);

        if (process.getuid() === stat.uid) {
            return (stat.mode & S_IWUSR) === S_IWUSR;
        } else if (process.getgid() === stat.gid) {
            return (stat.mode & S_IWGRP) === S_IWGRP;
        }

        return (stat.mode & S_IWOTH) === S_IWOTH;
    }

    /**
     * Tells whether a file is a directory.
     *
     * @param {string} path Path to the file
     *
     * @returns {Promise<boolean>}
     */
    async isDir(path) {
        const stat = await StreamWrapper.get(path).stat(path);

        return stat ? stat.isDirectory() : false;
    }

    /**
     * Tells whether a file is a file (not a directory or a device).
     *
     * @param {string} path Path to the file
     *
     * @returns {Promise<boolean>}
     */
    async isFile(path) {
        const stat = await StreamWrapper.get(path).stat(path);

        return stat ? stat.isFile() : false;
    }

    /**
     * Tells whether a file is a symlink.
     *
     * @param {string} path Path to the file
     *
     * @returns {Promise<boolean>}
     */
    async isLink(path) {
        const stat = await StreamWrapper.get(path).stat(path);

        return stat ? stat.isSymbolicLink() : false;
    }
}

module.exports = Filesystem;
