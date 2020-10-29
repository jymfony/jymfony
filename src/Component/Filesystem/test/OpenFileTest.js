const OpenFile = Jymfony.Component.Filesystem.OpenFile;
const FileStreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.FileStreamWrapper;

const { expect } = require('chai');
const fs = require('fs');
const stream = require('stream');

describe('[Filesystem] OpenFile', function () {
    beforeEach(() => {
        FileStreamWrapper.stat_cache_ttl = -1;
    });

    it('fgetc should read one byte from stream', async () => {
        const file = await new OpenFile(__dirname + '/../fixtures/TESTFILE.txt', 'r');
        expect(await file.fgetc()).to.be.equal('T'.charCodeAt(0));
        expect(await file.fgetc()).to.be.equal('H'.charCodeAt(0));
        expect(await file.fgetc()).to.be.equal('I'.charCodeAt(0));

        await file.close();
    });

    it('fread should read from stream', async () => {
        const file = await new OpenFile(__dirname + '/../fixtures/TESTFILE.txt', 'r');
        expect(await file.fread(7)).to.be.deep.equal(Buffer.from('THIS IS'));
        expect(await file.fread(7)).to.be.deep.equal(Buffer.from(' A TEST'));
        expect(await file.fread(7)).to.be.deep.equal(Buffer.from('\n'));
        expect(await file.fread(7)).to.be.deep.equal(Buffer.from(''));

        await file.close();
    });

    it('createReadableStream should return a stream', async () => {
        const file = await new OpenFile(__dirname + '/../fixtures/TESTFILE.txt', 'r');
        const readable = await file.createReadableStream();

        expect(readable).to.be.instanceOf(stream.Readable);

        await file.close();
    });

    it('createWritableStream should return a stream', async () => {
        const file = await new OpenFile(__dirname + '/../fixtures/WRITEFILE', 'w');
        const writable = await file.createWritableStream();

        expect(writable).to.be.instanceOf(stream.Writable);

        await file.close();
    });

    it('fwrite should write to file', async () => {
        const file = await new OpenFile(__dirname + '/../fixtures/WRITEFILE', 'w');
        expect(await file.fwrite(Buffer.from('TEST FILE'))).to.be.equal(9);
        fs.fsyncSync((await file._resource).handle.fd);
        expect(await file.getSize()).to.be.equal(9);

        await file.close();
    });

    it('ftruncate should truncate to file', async () => {
        const file = await new OpenFile(__dirname + '/../fixtures/WRITEFILE', 'w');
        await file.ftruncate(0);
        expect(await file.getSize()).to.be.equal(0);

        await file.close();
    });
});
