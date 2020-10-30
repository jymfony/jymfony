import { Readable, Writable } from 'stream';
import { fsyncSync, readFileSync } from 'fs';
import { expect } from 'chai';
import { promisify } from 'util';

const OpenFile = Jymfony.Component.Filesystem.OpenFile;
const FileStreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.FileStreamWrapper;


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

        expect(readable).to.be.instanceOf(Readable);
        readable.on('data', buf => {
            expect(buf.toString('utf-8')).to.be.equal('THIS IS A TEST\n');
        });

        await new Promise((resolve, reject) => {
            readable.on('end', resolve);
            readable.on('error', reject);

            readable.read();
        });

        await file.close();
    });

    it('createWritableStream should return a stream', async () => {
        const path = __dirname + '/../fixtures/WRITEFILE';
        const file = await new OpenFile(path, 'w');
        const writable = await file.createWritableStream();

        expect(writable).to.be.instanceOf(Writable);
        await promisify(Writable.prototype.write).call(writable, 'This is ', 'utf-8');
        await promisify(Writable.prototype.write).call(writable, 'a te', 'utf-8');
        await promisify(Writable.prototype.write).call(writable, 'st of writing', 'utf-8');

        await file.close();

        const str = readFileSync(path, { encoding: 'utf-8' });
        expect(str).to.be.equal('This is a test of writing');
    });

    it('fwrite should write to file', async () => {
        const file = await new OpenFile(__dirname + '/../fixtures/WRITEFILE', 'w');
        expect(await file.fwrite(Buffer.from('TEST FILE'))).to.be.equal(9);

        fsyncSync((await file._resource).handle.fd);
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
