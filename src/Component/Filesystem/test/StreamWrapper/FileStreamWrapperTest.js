const FileStreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.FileStreamWrapper;
const Resource = Jymfony.Component.Filesystem.StreamWrapper.File.Resource;
const fs = require('fs');
const stream = require('stream');
const path = require('path');
const expect = require('chai').expect;

describe('[Filesystem] FileStreamWrapper', function () {
    const fixturesDir = __dirname+'/../../fixtures';
    before(() => {
        try {
            fs.rmdirSync(fixturesDir + path.sep + 'dir_1' + path.sep + 'dir_2');
        } catch (e) { }

        try {
            fs.rmdirSync(fixturesDir + path.sep + 'dir_1');
        } catch (e) { }

        try {
            fs.unlinkSync(fixturesDir + path.sep + 'WRITEFILE');
        } catch (e) { }
    });

    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Filesystem.StreamWrapper.FileStreamWrapper}
         *
         * @private
         */
        this._wrapper = new FileStreamWrapper();
    });

    it('readdir should work', async () => {
        /** @var string[] dir */
        const dir = await this._wrapper.readdir(fixturesDir);
        expect(dir.sort()).to.be.deep.equal([ '.gitignore', 'LINKFILE', 'RENAMEBLE_FILE', 'TESTFILE', 'Testdir' ]);
    });

    it('mkdir should throw if recursive flag is not set', async () => {
        return this._wrapper.mkdir(fixturesDir+'/dir_1/dir_2')
            .then(() => {
                fs.rmdirSync(fixturesDir+'/dir_1/dir_2');
                fs.rmdirSync(fixturesDir+'/dir_1');
                throw new Error('FAIL');
            }, e => {
                expect(e).to.be.instanceOf(Error);
                expect(e.code).to.be.equal('ENOENT');
            });
    });

    it('mkdir should create tree if recursive is set to true', async () => {
        return this._wrapper.mkdir(fixturesDir+'/dir_1/dir_2', 0o777, true)
            .then(() => {
                expect(
                    fs.statSync(fixturesDir+'/dir_1/dir_2').isDirectory()
                ).to.be.true;

                fs.rmdirSync(fixturesDir+'/dir_1/dir_2');
                fs.rmdirSync(fixturesDir+'/dir_1');
            });
    });

    it('rmdir should throw if directory is not empty', async () => {
        await this._wrapper.mkdir(fixturesDir+'/dir_1/dir_2', 0o777, true);

        return this._wrapper.rmdir(fixturesDir+'/dir_1')
            .then(() => {
                throw new Error('FAIL');
            }, () => {
                expect(
                    fs.statSync(fixturesDir+'/dir_1').isDirectory()
                ).to.be.true;

                try {
                    fs.rmdirSync(fixturesDir + '/dir_1/dir_2');
                    fs.rmdirSync(fixturesDir + '/dir_1');
                } catch (e) { }
            });
    });

    it('rmdir should remove directory', async () => {
        await this._wrapper.mkdir(fixturesDir+'/dir_1', 0o777, true);

        return this._wrapper.rmdir(fixturesDir+'/dir_1')
            .then(() => {
                expect(
                    () => fs.statSync(fixturesDir+'/dir_1')
                ).to.throw(Error);
            }, e => {
                try {
                    fs.rmdirSync(fixturesDir + '/dir_1');
                } catch (e) { }

                throw e;
            });
    });

    it('rename should rename files', async () => {
        fs.statSync(fixturesDir+'/RENAMEBLE_FILE');
        expect(() => fs.statSync(fixturesDir+'/RENAMED_FILE')).to.throw(Error);

        await this._wrapper.rename(fixturesDir+'/RENAMEBLE_FILE', fixturesDir+'/RENAMED_FILE');

        expect(() => fs.statSync(fixturesDir+'/RENAMEBLE_FILE')).to.throw(Error);
        expect(
            fs.statSync(fixturesDir+'/RENAMED_FILE').isFile()
        ).to.be.true;

        await this._wrapper.rename(fixturesDir+'/RENAMED_FILE', fixturesDir+'/RENAMEBLE_FILE');

        expect(() => fs.statSync(fixturesDir+'/RENAMED_FILE')).to.throw(Error);
        expect(
            fs.statSync(fixturesDir+'/RENAMEBLE_FILE').isFile()
        ).to.be.true;
    });

    it('streamOpen/streamClose should work', async () => {
        const resource = await this._wrapper.streamOpen(fixturesDir+'/TESTFILE', 'r');
        expect(resource).to.be.instanceOf(Resource);

        await this._wrapper.streamClose(resource);
    });

    it('createReadableStream/createWritableStream should work', async () => {
        const resource = await this._wrapper.streamOpen(fixturesDir+'/TESTFILE', 'r+');
        expect(this._wrapper.createReadableStream(resource)).to.be.instanceOf(stream.Readable);
        expect(this._wrapper.createWritableStream(resource)).to.be.instanceOf(stream.Writable);

        await this._wrapper.streamClose(resource);
    });

    it('streamRead should work', async () => {
        const resource = await this._wrapper.streamOpen(fixturesDir+'/TESTFILE', 'r');
        await expect(
            await this._wrapper.streamRead(resource, 1)
        ).to.be.deep.equal(Buffer.from('T'));
        await expect(
            await this._wrapper.streamRead(resource, 2)
        ).to.be.deep.equal(Buffer.from('HI'));

        await this._wrapper.streamClose(resource);
    });

    it('streamWrite should work', async () => {
        const resource = await this._wrapper.streamOpen(fixturesDir+'/WRITEFILE', 'w');
        await expect(
            await this._wrapper.streamWrite(resource, Buffer.from('foobar'))
        ).to.be.equal(6);

        await this._wrapper.streamClose(resource);
    });

    it('streamTruncate should work', async () => {
        const resource = await this._wrapper.streamOpen(fixturesDir+'/WRITEFILE', 'r+');
        await this._wrapper.streamTruncate(resource);
        await this._wrapper.streamClose(resource);

        await expect(
            fs.statSync(fixturesDir+'/WRITEFILE').size
        ).to.be.equal(0);
    });
});
