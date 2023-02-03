import * as path from 'path';
import { existsSync, realpathSync } from 'fs';
import { createHash } from 'crypto';
import { tmpdir } from 'os';

const CacheException = Jymfony.Contracts.Cache.Exception.CacheException;
const InvalidArgumentException = Jymfony.Contracts.Cache.Exception.InvalidArgumentException;
const DateTime = Jymfony.Component.DateTime.DateTime;
const RecursiveDirectoryIterator = Jymfony.Component.Filesystem.Iterator.RecursiveDirectoryIterator;
const File = Jymfony.Component.Filesystem.File;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const OpenFile = Jymfony.Component.Filesystem.OpenFile;

/**
 * @memberOf Jymfony.Component.Cache.Traits
 */
class FilesystemTrait {
    /**
     * @returns {Promise<boolean>}
     */
    async prune() {
        const filesystem = new Filesystem();
        const time = DateTime.unixTime;
        let pruned = true;

        const deleteIterator = new RecursiveDirectoryIterator(this._directory, RecursiveDirectoryIterator.CHILD_FIRST);
        await __jymfony.forAwait(deleteIterator, async file => {
            file = new File(file);
            let h;

            try {
                h = await file.openFile('r');
            } catch (e) {
                return;
            }

            const expiresAt = ~~(await h.fgets());
            await h.close();

            if (time >= expiresAt) {
                try {
                    await file.unlink();
                    pruned = ! await filesystem.exists(file.toString()) && pruned;
                } catch (e) {
                    pruned = false;
                }
            }
        });

        return pruned;
    }

    /**
     * @inheritdoc
     */
    async _doFetch(ids) {
        const values = {};
        const now = DateTime.unixTime;
        const filesystem = new Filesystem();

        for (let id of ids) {
            id = id.toString();

            const file = this._getFile(id);
            if (! await filesystem.exists(file)) {
                continue;
            }

            const h = new OpenFile(file, 'r');
            const expiresAt = ~~(await h.fgets());
            if (expiresAt && now >= expiresAt) {
                await h.close();
                try {
                    await h.unlink();
                } catch (e) {
                    // Do nothing
                }
            } else {
                const i = decodeURIComponent(__jymfony.rtrim(await h.fgets()));
                const value = await h.fread(await h.getSize());

                await h.close();
                if (i === id) {
                    values[id] = __jymfony.unserialize(value.toString());
                }
            }
        }

        return values;
    }

    /**
     * @inheritdoc
     */
    async _doHave(id) {
        id = id.toString();
        const filesystem = new Filesystem();
        const file = this._getFile(id);

        if (! await filesystem.exists(file)) {
            return false;
        }

        return await (new File(file)).getMtime() > DateTime.unixTime || !! (await this._doFetch([ id ]));
    }

    /**
     * @inheritdoc
     */
    async _doSave(values, lifetime) {
        let ok = true;
        const filesystem = new Filesystem();
        const expiresAt = lifetime ? (DateTime.unixTime + lifetime) : 0;

        for (const [ id, value ] of __jymfony.getEntries(values)) {
            try {
                await this._write(
                    this._getFile(id, true),
                    expiresAt + '\n' + encodeURIComponent(id) + '\n' + __jymfony.serialize(value),
                    expiresAt
                );
            } catch (e) {
                ok = false;
            }
        }

        if (! ok && ! await filesystem.isWritable(this._directory)) {
            throw new CacheException(__jymfony.sprintf('Cache directory is not writable (%s)', this._directory));
        }

        return ok;
    }

    _init(namespace, directory) {
        if (! directory) {
            directory = tmpdir();
        } else {
            try {
                directory = realpathSync(directory);
            } catch (e) {
                // Do nothing
            }
        }

        if (! namespace) {
            const match = namespace.match(/[^-+_.A-Za-z0-9]/);
            if (match) {
                throw new InvalidArgumentException(
                    __jymfony.sprintf('Namespace contains "%s" but only characters in [-+_.A-Za-z0-9] are allowed.', match[0])
                );
            }

            directory += path.sep + namespace;
        }

        if (! existsSync(directory)) {
            try {
                __jymfony.mkdir(directory, 0o777);
            } catch (e) {
                if ('EEXIST' !== e.code) {
                    throw e;
                }
            }
        }

        directory = __jymfony.rtrim(directory, path.sep);
        directory += path.sep;
        // On Windows the whole path is limited to 258 chars
        if ('\\' === path.sep && 234 < directory.length) {
            throw new InvalidArgumentException(__jymfony.sprintf('Cache directory too long (%s)', directory));
        }

        this._directory = directory;
    }

    /**
     * @inheritdoc
     */
    async _doClear() {
        let ok = true;
        const filesystem = new Filesystem();

        const deleteIterator = new RecursiveDirectoryIterator(this._directory, RecursiveDirectoryIterator.CHILD_FIRST);
        await __jymfony.forAwait(deleteIterator, async file => {
            file = new File(file);
            if (await file.isDirectory()) {
                return;
            }

            try {
                await file.unlink();
                return;
            } catch (e) {
                // Do nothing
            }

            ok = ! await filesystem.exists(file.filename) && ok;
        });

        return ok;
    }

    /**
     * @inheritdoc
     */
    async _doDelete(ids) {
        let ok = true;
        const filesystem = new Filesystem();

        for (const id of ids) {
            const file = new File(this._getFile(id));
            if (!await filesystem.exists(file.filename) || await file.isDirectory()) {
                continue;
            }

            try {
                await file.unlink();
                continue;
            } catch (e) {
                // Do nothing
            }

            ok = ! (await filesystem.exists(file.filename)) && ok;
        }

        return ok;
    }

    async _write(file, data /* , expiresAt = undefined */) {
        const tmp = this._directory + (Math.random() * 10000000);
        const filesystem = new Filesystem();

        const openFile = new OpenFile(tmp, 'w');
        await openFile.fwrite(Buffer.from(data));
        await openFile.close();

        await filesystem.rename(tmp, file, true);
    }

    _getFile(id, mkdir = false) {
        const hash = createHash('sha256');
        hash.update(ReflectionClass.getClassName(this) + id);
        id = hash.digest('base64').replace(/\//g, '-');

        const dir = this._directory + (id.charAt(0) + path.sep + id.charAt(1) + path.sep).toUpperCase();

        if (mkdir && ! existsSync(dir)) {
            try {
                __jymfony.mkdir(dir, 0o777);
            } catch (e) {
                if ('EEXIST' !== e.code) {
                    throw e;
                }
            }
        }

        return dir + id.substring(2, 20);
    }
}

export default getTrait(FilesystemTrait);
