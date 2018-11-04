const AdapterTestCase = require('./AdapterTestCase');
const FilesystemAdapter = Jymfony.Component.Cache.Adapter.FilesystemAdapter;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;

const os = require('os');

describe('[Cache] FilesystemAdapter', function () {
    const cacheFolder = os.tmpdir() + '/jymfony-cache';

    after(async () => {
        const fs = new Filesystem();
        await fs.remove(cacheFolder);
    });

    AdapterTestCase.shouldPassAdapterTests.call(this);

    this._createCachePool = (defaultLifetime = undefined) => {
        return new FilesystemAdapter('', defaultLifetime, cacheFolder);
    };
});
