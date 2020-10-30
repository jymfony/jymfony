import {
    chmod,
    chown,
    open as fopen,
    futimes,
    lstat,
    mkdir,
    readdir,
    readlink,
    realpath,
    rename,
    rmdir,
    symlink,
    unlink
} from 'fs/promises';
import { dirname, resolve as pathResolve } from 'path';
import { parse as urlParse } from 'url';

const AbstractStreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.AbstractStreamWrapper;
const File = Jymfony.Component.Filesystem.File;
const ReadableStream = Jymfony.Component.Filesystem.StreamWrapper.File.ReadableStream;
const Resource = Jymfony.Component.Filesystem.StreamWrapper.File.Resource;
const StreamWrapperInterface = Jymfony.Component.Filesystem.StreamWrapper.StreamWrapperInterface;
const WritableStream = Jymfony.Component.Filesystem.StreamWrapper.File.WritableStream;

const Storage = function () {};
Storage.prototype = {};

let statCache = new Storage();
let readlinkCache = new Storage();

/**
 * Implements a stream wrapper for the file:// protocol
 *
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper
 */
export default class FileStreamWrapper extends AbstractStreamWrapper {
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
        return readdir(__self._getPath(path), {});
    }

    /**
     * @inheritdoc
     */
    mkdir(path, mode = 0o777, recursive = false) {
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
        const result = await rmdir(__self._getPath(path));
        __self.clearStatCache();

        return result;
    }

    /**
     * @inheritdoc
     */
    async rename(fromPath, toPath) {
        const result = await rename(__self._getPath(fromPath), __self._getPath(toPath));
        __self.clearStatCache();

        return result;
    }

    /**
     * @inheritdoc
     */
    async streamOpen(path, mode) {
        path = __self._getPath(path);

        return new Resource(await fopen(path, mode, 0o666), await __self._stat(path));
    }

    /**
     * @inheritdoc
     */
    async streamClose(resource) {
        await resource.handle.close();
    }

    /**
     * @inheritdoc
     */
    createReadableStream(resource) {
        return new ReadableStream(resource);
    }

    /**
     * @inheritdoc
     */
    createWritableStream(resource) {
        return new WritableStream(resource);
    }

    /**
     * @inheritdoc
     */
    async streamRead(resource, count, position = 0, whence = File.SEEK_CUR) {
        const buf = Buffer.alloc(count);
        resource.seek(position, whence);

        const handle = resource.handle;
        const { bytesRead } = await handle.read(buf, 0, count, resource.position);

        resource.advance(bytesRead);
        if (bytesRead === count) {
            return buf;
        }

        return buf.slice(0, bytesRead);
    }

    /**
     * @inheritdoc
     */
    async streamWrite(resource, buffer, position = 0, whence = File.SEEK_CUR) {
        resource.seek(position, whence);

        const handle = resource.handle;
        const { bytesWritten } = await handle.write(Buffer.from(buffer), 0, buffer.length, resource.position);

        resource.advance(bytesWritten);

        return bytesWritten;
    }

    /**
     * @inheritdoc
     */
    streamTruncate(resource, length = 0) {
        resource.seek(0, File.SEEK_SET);

        return resource.handle.truncate(length);
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
                    return futimes(path, new Date(), new Date());

                case StreamWrapperInterface.META_OWNER:
                    return chown(path, value, stat.gid);

                case StreamWrapperInterface.META_GROUP:
                    return chown(path, stat.uid, value);

                case StreamWrapperInterface.META_ACCESS:
                    return chmod(path, value);
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
        const result = await unlink(__self._getPath(path));
        __self.clearStatCache();

        return result;
    }

    /**
     * @inheritdoc
     */
    symlink(origin, target) {
        origin = __self._getPath(origin);
        target = __self._getPath(target);

        return symlink(origin, target);
    }

    /**
     * @inheritdoc
     */
    readlink(path) {
        return readlink(__self._getPath(path));
    }

    /**
     * @inheritdoc
     */
    realpath(path) {
        return realpath(__self._getPath(path));
    }

    /**
     * @inheritdoc
     */
    get protocol() {
        return 'file';
    }
}

FileStreamWrapper.stat_cache_ttl = 2;
