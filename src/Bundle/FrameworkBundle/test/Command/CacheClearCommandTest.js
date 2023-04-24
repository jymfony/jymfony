import { readFileSync } from 'fs';
import { sep } from 'path';

const ArrayInput = Jymfony.Component.Console.Input.ArrayInput;
const ConfigCacheFactory = Jymfony.Component.Config.ConfigCacheFactory;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const NullOutput = Jymfony.Component.Console.Output.NullOutput;
const TestAppKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.CacheClear.TestAppKernel;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class CacheClearCommandTest extends TestCase {
    _fs;
    _kernel;

    get testCaseName() {
        return '[FrameworkBundle] ' + super.testCaseName;
    }

    async beforeEach() {
        this._fs = new Filesystem();
        this._kernel = new TestAppKernel('test', true);
        await this._fs.mkdir(this._kernel.getProjectDir());

        await this._kernel.boot();
    }

    async afterEach() {
        await this._kernel.shutdown();
        await this._fs.remove(this._kernel.getProjectDir());
    }

    async testCacheShouldBeFreshAfterCacheClearWithWarmup() {
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

        // Check that app kernel file present in meta file of container's cache
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

        __self.assertTrue(found, 'Kernel file should be present as resource');
    }
}
