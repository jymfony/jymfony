import { AdapterTestCase } from './AdapterTestCase';
import { sep } from 'path';
import { tmpdir } from 'os';

const FilesystemAdapter = Jymfony.Component.Cache.Adapter.FilesystemAdapter;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const TimeSensitiveTestCaseTrait = Jymfony.Component.Testing.Framework.TimeSensitiveTestCaseTrait;
const cacheFolder = (process.env.RUNNER_TEMP ? process.env.RUNNER_TEMP : tmpdir()) + sep + 'jymfony-cache';

export default class FilesystemAdapterTest extends mix(AdapterTestCase, TimeSensitiveTestCaseTrait) {
    async after() {
        const fs = new Filesystem();
        await fs.remove(cacheFolder);
    }

    _createCachePool(defaultLifetime = undefined) {
        return new FilesystemAdapter('', defaultLifetime, cacheFolder);
    };
}
