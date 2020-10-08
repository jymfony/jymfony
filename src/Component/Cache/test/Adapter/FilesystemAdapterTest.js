import { AdapterTestCase } from './AdapterTestCase';
import { tmpdir } from 'os';

const FilesystemAdapter = Jymfony.Component.Cache.Adapter.FilesystemAdapter;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const cacheFolder = tmpdir() + '/jymfony-cache';

export default class FilesystemAdapterTest extends AdapterTestCase {
    async after() {
        const fs = new Filesystem();
        await fs.remove(cacheFolder);
    }

    _createCachePool(defaultLifetime = undefined) {
        return new FilesystemAdapter('', defaultLifetime, cacheFolder);
    };
}
