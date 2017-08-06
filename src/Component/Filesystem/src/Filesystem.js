const IOException = Jymfony.Component.Filesystem.Exception.IOException;
const RecursiveDirectoryIterator = Jymfony.Component.Filesystem.Iterator.RecursiveDirectoryIterator;
const fs = require('fs');
const path = require("path");

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
     * @param {boolean} overwriteNewerFiles If true, target files newer than origin files are overwritten
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When copy fails
     */
    * copy(originFile, targetFile, overwriteNewerFiles = false) {
        yield this.mkdir(path.dirname(targetFile));
        let originStat = yield this._doStat(targetFile);

        let doCopy = true;
        if (! overwriteNewerFiles && (yield this.isFile(targetFile))) {
            let targetStat = yield this._doStat(targetFile);
            doCopy = originStat.mtime > targetStat.mtime;
        }

        if (doCopy) {
            let rs = fs.createReadStream(originFile);
            let ws = fs.createWriteStream(targetFile);

            try {
                yield new Promise((resolve, reject) => {
                    rs.on('error', err => reject(err));
                    ws.on('error', err => reject(err));

                    ws.on('finish', resolve);
                    rs.pipe(ws);
                });
            } finally {
                rs.destroy();
                ws.end();
            }

            if (! (yield this.isFile(targetFile))) {
                throw new IOException(__jymfony.sprintf('Failed to copy "%s" to "%s".', originFile, targetFile), null, undefined, originFile);
            }

            fs.chmod(targetFile, originStat.mode);
            let targetStat = yield this._doStat(targetFile);
            if (targetStat.size !== originStat.size) {
                throw new IOException(__jymfony.sprintf('Failed to copy the whole content of "%s" to "%s" (%g of %g bytes copied).', originFile, targetFile, targetStat.size, originStat.size), null, undefined, originFile);
            }
        }
    }

    /**
     * Creates a directory recursively.
     *
     * @param {string|[string]} dirs The directory path
     * @param {int} mode The directory mode
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} On any directory creation failure
     */
    * mkdir(dirs, mode = 0o777) {
        if (! isArray(dirs)) {
            dirs = [ dirs ];
        }

        for (let dir of dirs) {
            if (yield this.isDir(dir)) {
                continue;
            }

            try {
                yield this._mkdirRecursive(dir, mode);
            } catch (err) {
                if (! (yield this.isDir(dir))) {
                    // The directory was not created by a concurrent process. Let's throw an exception with a developer friendly error message if we have one
                    throw new IOException(__jymfony.sprintf('Failed to create "%s": %s.', dir, err.message), null, undefined, dir);
                }
            }
        }
    }

    /**
     * Checks the existence of files or directories.
     *
     * @param {string|[string]} files A filename, an array of files to check
     *
     * @returns {boolean} true if the file exists, false otherwise
     */
    * exists(files) {
        if (! isArray(files)) {
            files = [ files ];
        }

        for (let file of files) {
            try {
                yield this._doStat(file);
            } catch (err) {
                return false;
            }
        }

        return true;
    }

    /**
     * Removes files or directories.
     *
     * @param {string|[string]} files A filename, an array of files to remove
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When removal fails
     */
    * remove(files) {
        if (! isArray(files)) {
            files = [ files ];
        }

        for (let file of files.reverse()) {
            if (yield this.isDir(file)) {
                yield this.remove((yield this.readdir(file)).map(f => path.join(file, f)));

                try {
                    yield this._doRmdir(file);
                } catch (err) {
                    throw new IOException(__jymfony.sprintf('Failed to remove directory "%s": %s.', file, err.message));
                }
            } else {
                try {
                    yield this._doUnlink(file);
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
     * @param {Object} options An array of boolean options
     *                         Valid options are:
     *                            - options['override'] Whether to override an existing file on copy or not (see copy())
     *                            - options['copy_on_windows'] Whether to copy files instead of links on Windows (see symlink())
     *                            - options['delete'] Whether to delete files that are not in the source directory (defaults to false)
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When file type is unknown
     */
    * mirror(originDir, targetDir, options = {}) {
        targetDir = __jymfony.rtrim(targetDir, '/\\');
        originDir = __jymfony.rtrim(originDir, '/\\');

        // Iterate in destination folder to remove obsolete entries
        if ((yield this.exists(targetDir)) && options['delete']) {
            let deleteIterator = new RecursiveDirectoryIterator(targetDir, RecursiveDirectoryIterator.CHILD_FIRST);
            for (let file of deleteIterator) {
                let origin = file.replace(targetDir, originDir);
                if (! (yield this.exists(origin))) {
                    yield this.remove(file);
                }
            }
        }

        let copyOnWindows = __jymfony.Platform.isWindows() && !! options.copy_on_windows;
        let flags = copyOnWindows ? RecursiveDirectoryIterator.FOLLOW_SYMLINKS : 0;
        let iterator = new RecursiveDirectoryIterator(originDir, flags | RecursiveDirectoryIterator.CHILD_LAST);

        if (! (yield this.exists(targetDir))) {
            yield this.mkdir(targetDir);
        }

        for (let file of iterator) {
            let target = file.replace(originDir, targetDir);
            let stat = yield this._doStat(file, copyOnWindows);

            if (copyOnWindows) {
                if (stat.isFile()) {
                    yield this.copy(file, target, !! options.override);
                } else if (stat.isDirectory()) {
                    yield this.mkdir(target);
                } else {
                    throw new IOException(__jymfony.sprintf('Unable to guess "%s" file type.', file), null, undefined, file);
                }
            } else {
                if (stat.isSymbolicLink()) {
                    yield this.symlink(yield this.readlink(file), target);
                } else if (stat.isDirectory()) {
                    yield this.mkdir(target);
                } else if (stat.isFile()) {
                    yield this.copy(file, target, !! options.override);
                } else {
                    throw new IOException(__jymfony.sprintf('Unable to guess "%s" file type.', file), null, undefined, file);
                }
            }
        }
    }

    /**
     * Renames a file or a directory.
     *
     * @param {string} origin The origin filename or directory
     * @param {string} target The new filename or directory
     * @param {boolean} overwrite Whether to overwrite the target if it already exists
     *
     * @returns {Promise}
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When target file or directory already exists
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When origin cannot be renamed
     */
    * rename(origin, target, overwrite = false) {
        // We check that target does not exist
        if (! overwrite && (yield this.isReadable(target))) {
            throw new IOException(__jymfony.sprintf('Cannot rename because the target "%s" already exists.', target), null, undefined, target);
        }

        try {
            yield this._doRename(origin, target);
        } catch (err) {
            if (! (yield this.isDir(origin))) {
                throw new IOException(__jymfony.sprintf('Cannot rename "%s" to "%s".', origin, target), null, undefined, target);
            }

            yield this.mirror(origin, target, { override: overwrite, 'delete': overwrite });
            yield this.remove(origin);
        }
    }

    /**
     * Creates a symbolic link or copy a directory.
     *
     * @param {string} originDir     The origin directory path
     * @param {string} targetDir     The symbolic link name
     * @param {boolean} copyOnWindows Whether to copy files if on Windows
     *
     * @throws {Jymfony.Component.Filesystem.Exception.IOException} When symlink fails
     */
    * symlink(originDir, targetDir, copyOnWindows = false) {
        if (__jymfony.Platform.isWindows()) {
            originDir = originDir.replace('/', '\\');
            targetDir = targetDir.replace('/', '\\');

            if (copyOnWindows) {
                yield this.mirror(originDir, targetDir);
                return;
            }
        }

        yield this.mkdir(path.dirname(targetDir));

        let ok = false;
        if (yield this.isLink(targetDir)) {
            if ((yield this.readlink(targetDir)) !== originDir) {
                this.remove(targetDir);
            } else {
                ok = true;
            }
        }

        let promise = new Promise(resolve => {
            fs.symlink(originDir, targetDir, 'dir', err => {
                resolve(! err);
            });
        });

        if (! ok && ! (yield promise)) {
            throw new IOException(__jymfony.sprintf('Failed to create symbolic link from "%s" to "%s".', originDir, targetDir), null, undefined, targetDir);
        }
    }

    /**
     * Resolves links in paths.
     *
     * With canonicalize = false (default)
     *      - if path does not exist or is not a link, returns null
     *      - if path is a link, returns the next direct target of the link without considering the existence of the target
     *
     * With canonicalize = true
     *      - if path does not exist, returns null
     *      - if path exists, returns its absolute fully resolved final version
     *
     * @param {string} path A filesystem path
     * @param {boolean} canonicalize Whether or not to return a canonicalized path
     *
     * @returns {string|null}
     */
    * readlink(path, canonicalize = false) {
        if (! canonicalize && ! (yield this.isLink(path))) {
            return null;
        }

        if (canonicalize) {
            if (! (yield this.exists(path))) {
                return null;
            }

            if (__jymfony.Platform.isWindows()) {
                path = yield this._doReadlink(path);
            }

            return yield this._doRealpath(path);
        }

        if (__jymfony.Platform.isWindows()) {
            return yield this._doRealpath(path);
        }

        return yield this._doReadlink(path);
    }

    /**
     * Reads the contents of a directory.
     *
     * @param path
     *
     * @return {[string]}
     */
    * readdir(path) {
        return yield new Promise((resolve, reject) => {
            fs.readdir(path, {}, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }

    /**
     * Tells whether a file exists and is readable.
     *
     * @param {string} filename Path to the file
     *
     * @returns {boolean}
     */
    * isReadable(filename) {
        return yield this._doAccess(filename, fs.constants.R_OK);
    }

    /**
     * Tells whether a file exists and is writable.
     *
     * @param {string} filename Path to the file
     *
     * @returns {boolean}
     */
    * isWritable(filename) {
        return yield this._doAccess(filename, fs.constants.W_OK);
    }

    /**
     * Tells whether a file is a directory.
     *
     * @param {string} path Path to the file
     *
     * @returns {boolean}
     */
    * isDir(path) {
        return (yield this._doStat(path)).isDirectory();
    }

    /**
     * Tells whether a file is a file (not a directory or a device).
     *
     * @param {string} path Path to the file
     *
     * @returns {boolean}
     */
    * isFile(path) {
        return (yield this._doStat(path)).isFile();
    }

    /**
     * Tells whether a file is a symlink.
     *
     * @param {string} path Path to the file
     *
     * @returns {boolean}
     */
    * isLink(path) {
        return (yield this._doStat(path, true)).isSymbolicLink();
    }

    /**
     * Converts fs.access call to a promise.
     *
     * @param {string} filename
     * @param {int} mode
     *
     * @returns {Promise}
     *
     * @private
     */
    _doAccess(filename, mode) {
        return new Promise(resolve => {
            fs.access(filename, mode, err => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * Converts fs.rename to a promise.
     *
     * @param {string} origin
     * @param {string} target
     *
     * @returns {Promise}
     *
     * @private
     */
    _doRename(origin, target) {
        return new Promise((resolve, reject) => {
            fs.rename(origin, target, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Converts fs.stat (or lstat) to a promise.
     *
     * @param {string} file
     * @param {boolean} followSymlink
     *
     * @returns {Promise}
     *
     * @private
     */
    _doStat(file, followSymlink = true) {
        return new Promise((resolve, reject) => {
            fs[followSymlink ? 'stat' : 'lstat'](file, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stats);
                }
            });
        });
    }

    /**
     * Converts fs.mkdir to a promise.
     *
     * @param {string} path
     * @param {int} mode
     *
     * @returns {Promise}
     *
     * @private
     */
    _doMkdir(path, mode) {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, mode, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Converts fs.rmdir to a promise.
     *
     * @param {string} file
     *
     * @returns {Promise}
     *
     * @private
     */
    _doRmdir(file) {
        return new Promise((resolve, reject) => {
            fs.rmdir(file, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Calls mkdir recursively.
     *
     * @param {string} dir
     * @param {int} mode
     *
     * @private
     */
    * _mkdirRecursive(dir, mode) {
        for (let i = 2; 0 < i; i--) {
            try {
                yield this._doMkdir(dir, mode);
                break;
            } catch (e) {
                if ('ENOENT' !== e.code) {
                    throw e;
                }

                yield this._mkdirRecursive(path.dirname(dir), mode);
            }
        }
    }

    /**
     * Converts readlink call to a promise.
     *
     * @param {string} file
     *
     * @return {Promise}
     *
     * @private
     */
    _doReadlink(file) {
        return new Promise((resolve, reject) => {
            fs.readlink(file, {}, (err, linkString) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(linkString);
            });
        });
    }

    /**
     * Converts realpath call to a promise.
     *
     * @param {string} file
     *
     * @return {Promise}
     *
     * @private
     */
    _doRealpath(file) {
        return new Promise((resolve, reject) => {
            fs.realpath(file, {}, (err, resolvedPath) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(resolvedPath);
            });
        });
    }

    /**
     * Converts unlink call to a promise.
     *
     * @param {string} file
     *
     * @return {Promise}
     *
     * @private
     */
    _doUnlink(file) {
        return new Promise((resolve, reject) => {
            fs.unlink(file, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = Filesystem;
