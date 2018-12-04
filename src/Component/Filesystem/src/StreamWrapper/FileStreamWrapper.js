const File = Jymfony.Component.Filesystem.File;
const AbstractStreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.AbstractStreamWrapper;
const Resource = Jymfony.Component.Filesystem.StreamWrapper.File.Resource;
const StreamWrapperInterface = Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface;

const fs = require('fs');
const dirname = require('path').dirname;
const pathResolve = require('path').resolve;
const urlParse = require('url').parse;
const promisify = require('util').promisify;

const Storage = function () {};
Storage.prototype = {};

let statCache = new Storage();
let readlinkCache = new Storage();

/**
 * Implements a stream wrapper for the file:// protocol
 *
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper
 */
class FileStreamWrapper extends AbstractStreamWrapper {
    /**
     * Normalizes path and urls to a simple path.
     *
     * @param {string} path
     *
     * @returns {string}
     *
     * @private
     */
    static _getPath(path) {
        if (0 > path.indexOf('file:')) {
            return path;
        }

        return decodeURIComponent(urlParse(path).pathname);
    }

    /**
     * Cached and promisified readlink.
     *
     * @param {string} path
     *
     * @returns {Promise<string>}
     *
     * @private
     */
    static async _readlink(path) {
        const readlink = promisify(fs.readlink);
        if (0 > __self.stat_cache_ttl) {
            return await readlink(path);
        }

        const cached = readlinkCache[path];
        const now = ~~(Date.now() / 1000);
        if (undefined !== cached) {
            if (cached.timestamp > now) {
                return cached.link;
            }

            delete readlinkCache[path];
        }

        const link = await readlink(path);
        statCache[path] = {
            timestamp: now + __self.stat_cache_ttl,
            link,
        };

        return link;
    }

    /**
     * Cached, promisified lstat.
     *
     * @param path
     *
     * @returns {Promise<fs.Stats>}
     *
     * @private
     */
    static async _stat(path) {
        const lstat = promisify(fs.lstat);

        if (0 > __self.stat_cache_ttl) {
            return await lstat(path);
        }

        const cached = statCache[path];
        const now = ~~(Date.now() / 1000);
        if (undefined !== cached) {
            if (cached.timestamp > now) {
                return cached.stat;
            }

            delete statCache[path];
        }

        const stat = await lstat(path);
        statCache[path] = {
            timestamp: now + __self.stat_cache_ttl,
            stat,
        };

        return stat;
    }

    /**
     * Flushes the stat and readlink caches.
     *
     * @private
     */
    static clearStatCache() {
        statCache = new Storage();
        readlinkCache = new Storage();
    }

    /**
     * @inheritdoc
     */
    readdir(path) {
        return promisify(fs.readdir)(__self._getPath(path), {});
    }

    /**
     * @inheritdoc
     */
    mkdir(path, mode = 0o777, recursive = false) {
        const mkdir = promisify(fs.mkdir);
        const mkdirRecursive = async function mkdirRecursive(dir, mode) {
            for (let i = 2; 0 < i; i--) {
                try {
                    await mkdir(dir, mode);
                    break;
                } catch (e) {
                    if ('ENOENT' !== e.code) {
                        throw e;
                    }

                    await mkdirRecursive(dirname(dir), mode);
                }
            }
        };

        path = __self._getPath(path);
        if (recursive) {
            return mkdirRecursive(path, mode);
        }

        return mkdir(path, mode);
    }

    /**
     * @inheritdoc
     */
    async rmdir(path) {
        const result = await promisify(fs.rmdir)(__self._getPath(path));
        __self.clearStatCache();

        return result;
    }

    /**
     * @inheritdoc
     */
    rename(fromPath, toPath) {
        return promisify(fs.rename)(__self._getPath(fromPath), __self._getPath(toPath));
    }

    /**
     * @inheritdoc
     */
    async streamOpen(path, mode) {
        path = __self._getPath(path);

        return new Resource(await promisify(fs.open)(path, mode, 0o666), await __self._stat(path));
    }

    /**
     * @inheritdoc
     */
    async streamClose(resource) {
        await promisify(fs.close)(resource.fd);
    }

    /**
     * @inheritdoc
     */
    createReadableStream(resource) {
        return fs.createReadStream(null, {
            fd: resource.fd,
            autoClose: false,
        });
    }

    /**
     * @inheritdoc
     */
    createWritableStream(resource) {
        return fs.createWriteStream(null, {
            fd: resource.fd,
            autoClose: false,
        });
    }

    /**
     * @inheritdoc
     */
    async streamRead(resource, count, position = 0, whence = File.SEEK_CUR) {
        const buf = Buffer.alloc(count);

        resource.seek(position, whence);
        const result = await new Promise((resolve, reject) => {
            fs.read(resource.fd, buf, 0, count, resource.position, (err, bytesRead) => {
                if (err) {
                    reject(err);
                }

                resource.advance(count);
                resolve(bytesRead);
            });
        });

        if (result === count) {
            return buf;
        }

        return buf.slice(0, result);
    }

    /**
     * @inheritdoc
     */
    async streamWrite(resource, buffer, position = 0, whence = File.SEEK_CUR) {
        resource.seek(position, whence);
        const result = await promisify(fs.write)(resource.fd, buffer, 0, buffer.length, resource.position);
        resource.advance(buffer.length);

        return result.bytesWritten;
    }

    /**
     * @inheritdoc
     */
    streamTruncate(resource, length = 0) {
        resource.seek(0, File.SEEK_SET);

        return promisify(fs.ftruncate)(resource.fd, length);
    }

    /**
     * @inheritdoc
     */
    async metadata(path, option, value) {
        path = __self._getPath(path);
        const stat = await __self._stat(path);

        const p = (() => {
            switch (option) {
                case StreamWrapperInterface.META_TOUCH:
                    return promisify(fs.futimes)(path, new Date(), new Date());

                case StreamWrapperInterface.META_OWNER:
                    return promisify(fs.chown)(path, value, stat.gid);

                case StreamWrapperInterface.META_GROUP:
                    return promisify(fs.chown)(path, stat.uid, value);

                case StreamWrapperInterface.META_ACCESS:
                    return promisify(fs.chmod)(path, value);
            }
        })();

        const result = await p;
        __self.clearStatCache();

        return result;
    }

    /**
     * @inheritdoc
     */
    async stat(path, options = { stat_link: false }) {
        path = __self._getPath(path);
        let stat;

        try {
            if (options.stat_link) {
                return await __self._stat(path);
            }

            while (true) {
                stat = await __self._stat(path);
                if (! stat.isSymbolicLink()) {
                    break;
                }

                path = pathResolve(dirname(path), await __self._readlink(path));
            }
        } catch (e) {
            if ('ENOENT' === e.code) {
                return false;
            }

            throw e;
        }

        return stat;
    }

    /**
     * @inheritdoc
     */
    async unlink(path) {
        const result = await promisify(fs.unlink)(__self._getPath(path));
        __self.clearStatCache();

        return result;
    }

    /**
     * @inheritdoc
     */
    symlink(origin, target) {
        origin = __self._getPath(origin);
        target = __self._getPath(target);

        return promisify(fs.symlink)(origin, target);
    }

    /**
     * @inheritdoc
     */
    readlink(path) {
        return promisify(fs.readlink)(__self._getPath(path));
    }

    /**
     * @inheritdoc
     */
    realpath(path) {
        return promisify(fs.realpath)(__self._getPath(path));
    }

    /**
     * @inheritdoc
     */
    get protocol() {
        return 'file';
    }
}

FileStreamWrapper.stat_cache_ttl = 2;

module.exports = FileStreamWrapper;
