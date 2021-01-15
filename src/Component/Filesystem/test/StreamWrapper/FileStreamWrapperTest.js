import { Readable, Writable } from 'stream';
import fs from 'fs';
import path from 'path';

const FileStreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.FileStreamWrapper;
const Resource = Jymfony.Component.Filesystem.StreamWrapper.File.Resource;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const fixturesDir = __dirname+'/../../fixtures';
export default class FileStreamWrapperTest extends TestCase {
    __construct() {
        super.__construct();

        /**
         * @type {Jymfony.Component.Filesystem.StreamWrapper.FileStreamWrapper}
         *
         * @private
         */
        this._wrapper = undefined;
    }

    get testCaseName() {
        return '[Filesystem] FileStreamWrapper';
    }

    before() {
        try {
            fs.rmdirSync(fixturesDir + path.sep + 'dir_1' + path.sep + 'dir_2');
        } catch (e) { }

        try {
            fs.rmdirSync(fixturesDir + path.sep + 'dir_1');
        } catch (e) { }

        try {
            fs.unlinkSync(fixturesDir + path.sep + 'WRITEFILE');
        } catch (e) { }
    }

    beforeEach() {
        this._wrapper = new FileStreamWrapper();
    }

    async testReaddirShouldWork() {
        /** @var string[] dir */
        const dir = await this._wrapper.readdir(fixturesDir);
        __self.assertEquals([ '.gitignore', 'LINKFILE', 'RENAMEBLE_FILE', 'TESTFILE.txt', 'Testdir' ], dir.sort());
    }

    async testMkdirShouldThrowIfRecursiveFlagIsNotSet() {
        this.expectException(Error);
        this.expectExceptionMessageRegex(/ENOENT/);

        await this._wrapper.mkdir(fixturesDir + '/dir_1/dir_2');

        // Executed only on fail
        fs.rmdirSync(fixturesDir + '/dir_1/dir_2');
        fs.rmdirSync(fixturesDir + '/dir_1');
        this.fail('Expected ENOENT error');
    }

    async testMkdirShouldCreateTreeIfRecursiveIsSetToTrue() {
        await this._wrapper.mkdir(fixturesDir+'/dir_1/dir_2', 0o777, true);
        __self.assertTrue(fs.statSync(fixturesDir+'/dir_1/dir_2').isDirectory());

        fs.rmdirSync(fixturesDir+'/dir_1/dir_2');
        fs.rmdirSync(fixturesDir+'/dir_1');
    }

    async testRmdirShouldThrowIfDirectoryIsNotEmpty() {
        await this._wrapper.mkdir(fixturesDir+'/dir_1/dir_2', 0o777, true);

        try {
            await this._wrapper.rmdir(fixturesDir+'/dir_1');
        } catch (e) {
            __self.assertTrue(fs.statSync(fixturesDir+'/dir_1').isDirectory());

            try {
                fs.rmdirSync(fixturesDir + '/dir_1/dir_2');
                fs.rmdirSync(fixturesDir + '/dir_1');
            } catch (e) { }

            return;
        }

        this.fail('Expected Error');
    }

    async testRmdirShouldRemoveDirectory() {
        await this._wrapper.mkdir(fixturesDir+'/dir_1', 0o777, true);

        try {
            await this._wrapper.rmdir(fixturesDir + '/dir_1');

            this.expectException(Error);
            fs.statSync(fixturesDir+'/dir_1');
        } finally {
            try {
                fs.rmdirSync(fixturesDir + '/dir_1');
            } catch (e) { }
        }
    }

    async testRenameShouldRenameFiles() {
        fs.statSync(fixturesDir+'/RENAMEBLE_FILE');
        try {
            fs.statSync(fixturesDir+'/RENAMED_FILE');
            this.fail('Expected Error');
        } catch (e) { }

        await this._wrapper.rename(fixturesDir+'/RENAMEBLE_FILE', fixturesDir+'/RENAMED_FILE');

        try {
            fs.statSync(fixturesDir+'/RENAMEBLE_FILE');
            this.fail('Expected Error');
        } catch (e) { }

        __self.assertTrue(fs.statSync(fixturesDir+'/RENAMED_FILE').isFile());

        await this._wrapper.rename(fixturesDir+'/RENAMED_FILE', fixturesDir+'/RENAMEBLE_FILE');

        try {
            fs.statSync(fixturesDir+'/RENAMED_FILE');
            this.fail('Expected Error');
        } catch (e) { }

        __self.assertTrue(fs.statSync(fixturesDir+'/RENAMEBLE_FILE').isFile());
    }

    async testStreamOpenStreamCloseShouldWork() {
        const resource = await this._wrapper.streamOpen(fixturesDir+'/TESTFILE.txt', 'r');
        __self.assertInstanceOf(Resource, resource);

        await this._wrapper.streamClose(resource);
    }

    async testCreateReadableStreamAndCreateWritableStreamShouldWork() {
        const resource = await this._wrapper.streamOpen(fixturesDir+'/TESTFILE.txt', 'r+');
        __self.assertInstanceOf(Readable, this._wrapper.createReadableStream(resource));
        __self.assertInstanceOf(Writable, this._wrapper.createWritableStream(resource));

        await this._wrapper.streamClose(resource);
    }

    async testStreamReadShouldWork() {
        const resource = await this._wrapper.streamOpen(fixturesDir+'/TESTFILE.txt', 'r');
        __self.assertEquals(Buffer.from('T'), await this._wrapper.streamRead(resource, 1));
        __self.assertEquals(Buffer.from('HI'), await this._wrapper.streamRead(resource, 2));

        await this._wrapper.streamClose(resource);
    }

    async testStreamWriteShouldWork() {
        const resource = await this._wrapper.streamOpen(fixturesDir+'/WRITEFILE', 'w');
        __self.assertEquals(6, await this._wrapper.streamWrite(resource, Buffer.from('foobar')));

        await this._wrapper.streamClose(resource);
    }

    async testStreamTruncateShouldWork() {
        const resource = await this._wrapper.streamOpen(fixturesDir+'/WRITEFILE', 'r+');
        await this._wrapper.streamTruncate(resource);
        await this._wrapper.streamClose(resource);

        __self.assertEquals(0, fs.statSync(fixturesDir+'/WRITEFILE').size);
    }
}
