const UnsupportedOperationException = Jymfony.Component.Filesystem.Exception.UnsupportedOperationException;
const File = Jymfony.Component.Filesystem.File;
const AbstractStreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.AbstractStreamWrapper;
const Resource = Jymfony.Component.Filesystem.StreamWrapper.Http.Resource;

const Storage = function () {};
Storage.prototype = {};

const statCache = new Storage();
const headCache = new Storage();

/**
 * Implements a stream wrapper for the http:// protocol
 *
 * @memberOf Jymfony.Component.Filesystem.StreamWrapper
 */
export default class HttpStreamWrapper extends AbstractStreamWrapper {
    static async head(path) {
        if (0 > __self.stat_cache_ttl) {
            return await Resource.head(path);
        }

        const cached = headCache[path];
        const now = ~~(Date.now() / 1000);
        if (undefined !== cached) {
            if (cached.timestamp > now) {
                return cached.headers;
            }

            delete headCache[path];
        }

        const headers = await Resource.head(path);
        headCache[path] = {
            timestamp: now + __self.stat_cache_ttl,
            headers,
        };

        return headers;
    }

    static async lstat(path) {
        const res = new Resource(path, await __self.head(path));

        return {
            dev: null,
            ino: null,
            mode: (res.isLink ? 0o120000 : 0o100000) | 0o666,
            nlink: 1,
            uid: process.getuid(),
            gid: process.getgid(),
            rdev: 0,
            size: res.size,
            blksize: undefined,
            blocks: undefined,
            atimeMs: Date.now(),
            mtimeMs: res.date.getTime(),
            ctimeMs: res.date.getTime(),
            birthtimeMs: res.date.getTime(),
            atime: new Date(),
            mtime: res.date,
            ctime: res.date,
            birthtime: res.date,
            isDirectory: () => false,
            isFile: () => ! res.isLink,
            isBlockDevice: () => false,
            isCharacterDevice: () => false,
            isSymbolicLink: () => res.isLink,
            isFIFO: () => false,
            isSocket: () => false,
        };
    }

    /**
     * Cached, promisified lstat.
     *
     * @param path
     *
     * @returns {Promise<fs.Stats>}
     */
    static async stat(path) {
        if (0 > __self.stat_cache_ttl) {
            return await __self.lstat(path);
        }

        const cached = statCache[path];
        const now = ~~(Date.now() / 1000);
        if (undefined !== cached) {
            if (cached.timestamp > now) {
                return cached.stat;
            }

            delete statCache[path];
        }

        const stat = await __self.lstat(path);
        statCache[path] = {
            timestamp: now + __self.stat_cache_ttl,
            stat,
        };

        return stat;
    }

    /**
     * @inheritdoc
     */
    async streamOpen(path) {
        return new Resource(path, await __self.head(path));
    }

    /**
     * @inheritdoc
     */
    async streamClose() {
        // Do nothing.
    }

    /**
     * @inheritdoc
     */
    createReadableStream(resource) {
        return resource.readableStream();
    }

    /**
     * @inheritdoc
     */
    async streamRead(resource, count, position = 0, whence = File.SEEK_CUR) {
        if (whence !== File.SEEK_CUR) {
            throw new UnsupportedOperationException('Seeking from custom point is not supported in http resources.');
        }

        resource.seek(position, whence);

        return resource.fread(count);
    }

    /**
     * @inheritdoc
     */
    async stat(path, options = { stat_link: false }) {
        let stat;

        try {
            if (options.stat_link) {
                return await __self.stat(path);
            }

            while (true) {
                stat = await __self.stat(path);
                if (! stat.isSymbolicLink()) {
                    break;
                }

                path = await this.readlink(path);
            }
        } catch (e) {
            if ('ENOENT' === e.code) {
                return false;
            }

            throw e;
        }

        stat.location = path;
        return stat;
    }

    /**
     * @inheritdoc
     */
    async readlink(path) {
        const resource = new Resource(path, await __self.head(path));

        return resource.location;
    }

    /**
     * @inheritdoc
     */
    get protocol() {
        return 'http';
    }
}

HttpStreamWrapper.stat_cache_ttl = 2;
