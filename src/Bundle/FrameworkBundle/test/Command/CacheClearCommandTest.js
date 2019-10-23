require('../../fixtures/namespace');

const Application = Jymfony.Bundle.FrameworkBundle.Console.Application;
const TestAppKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.CacheClear.TestAppKernel;
const ConfigCacheFactory = Jymfony.Component.Config.ConfigCacheFactory;
const ArrayInput = Jymfony.Component.Console.Input.ArrayInput;
const NullOutput = Jymfony.Component.Console.Output.NullOutput;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const { expect } = require('chai');
const { readFileSync } = require('fs');
const { sep } = require('path');

describe('[FrameworkBundle] CacheClearCommand', function () {
    this.timeout(60000);

    beforeEach(async () => {
        this._fs = new Filesystem();
        this._kernel = new TestAppKernel('test', true);
        await this._fs.mkdir(this._kernel.getProjectDir());

        await this._kernel.boot();
    });

    afterEach(async () => {
        await this._fs.remove(this._kernel.getProjectDir());
    });

    it ('cache should be fresh after cache clear with warmup', async () => {
        const input = new ArrayInput({command: 'cache:clear'});
        const application = this._kernel.container.get('console.application');
        application.catchExceptions = false;

        await application._doRun(input, new NullOutput());

        const configCacheFactory = new ConfigCacheFactory(true);
        for (const file of await this._fs.readdir(this._kernel.getCacheDir())) {
            if (! file.match(/\.js\.meta$/)) {
                continue;
            }

            configCacheFactory.cache(this._kernel.getCacheDir() + sep + file.substr(0, file.length - 5), () => {
                throw new Error(__jymfony.sprintf('Meta file "%s" is not fresh', file));
            });
        }

        // check that app kernel file present in meta file of container's cache
        const containerClass = this._kernel.container.getParameter('kernel.container_class');
        const containerFile = this._kernel.getCacheDir() + sep + containerClass + '.js';
        const containerMetaFile = containerFile + '.meta';
        const kernelFile = new ReflectionClass(TestAppKernel).filename;

        const meta = __jymfony.unserialize(readFileSync(containerMetaFile, { encoding: 'utf-8' }));
        let found = false;
        for (const resource of meta) {
             if (String(resource) === kernelFile) {
                 found = true;
                 break;
             }
        }

        expect(found, 'Kernel file should be present as resource').to.be.true;
    });
});
