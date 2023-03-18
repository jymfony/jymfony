import { sep } from 'path';
import { tmpdir } from 'os';

const AdapterTestCase = Jymfony.Component.Cache.Tests.Adapter.AdapterTestCase;
const FilesystemAdapter = Jymfony.Component.Cache.Adapter.FilesystemAdapter;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const cacheFolder = (process.env.RUNNER_TEMP ? process.env.RUNNER_TEMP : tmpdir()) + sep + 'jymfony-cache';

export default @timeSensitive() class FilesystemAdapterTest extends AdapterTestCase {
    async after() {
        const fs = new Filesystem();
        await fs.remove(cacheFolder);
    }

    _createCachePool(defaultLifetime = undefined) {
        return new FilesystemAdapter('', defaultLifetime, cacheFolder);
    };
}
