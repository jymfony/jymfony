import { Readable, Writable } from 'stream';
import { fsyncSync, readFileSync } from 'fs';
import { promisify } from 'util';

const OpenFile = Jymfony.Component.Filesystem.OpenFile;
const FileStreamWrapper = Jymfony.Component.Filesystem.StreamWrapper.FileStreamWrapper;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class OpenFileTest extends TestCase {
    beforeEach() {
        FileStreamWrapper.stat_cache_ttl = -1;
    }

    get testCaseName() {
        return '[Filesystem] OpenFile';
    }

    async testFgetcShouldReadOneByteFromStream() {
        const file = await new OpenFile(__dirname + '/../fixtures/TESTFILE.txt', 'r');
        __self.assertEquals('T'.charCodeAt(0), await file.fgetc());
        __self.assertEquals('H'.charCodeAt(0), await file.fgetc());
        __self.assertEquals('I'.charCodeAt(0), await file.fgetc());

        await file.close();
    }

    async testFreadShouldReadFromStream() {
        const file = await new OpenFile(__dirname + '/../fixtures/TESTFILE.txt', 'r');
        __self.assertEquals(Buffer.from('THIS IS'), await file.fread(7));
        __self.assertEquals(Buffer.from(' A TEST'), await file.fread(7));
        __self.assertEquals(Buffer.from('\n'), await file.fread(7));
        __self.assertEquals(Buffer.from(''), await file.fread(7));

        await file.close();
    }

    async testCreateReadableStreamShouldReturnAStream() {
        const file = await new OpenFile(__dirname + '/../fixtures/TESTFILE.txt', 'r');
        const readable = await file.createReadableStream();

        __self.assertInstanceOf(Readable, readable);
        readable.on('data', buf => {
            __self.assertEquals('THIS IS A TEST\n', buf.toString('utf-8'));
        });

        await new Promise((resolve, reject) => {
            readable.on('end', resolve);
            readable.on('error', reject);

            readable.read();
        });

        readable.removeAllListeners('error');
        readable.removeAllListeners('end');

        await file.close();
    }

    async testCreateWritableStreamShouldReturnAStream() {
        const path = __dirname + '/../fixtures/WRITEFILE';
        const file = await new OpenFile(path, 'w');
        const writable = await file.createWritableStream();

        __self.assertInstanceOf(Writable, writable);
        await promisify(Writable.prototype.write).call(writable, 'This is ', 'utf-8');
        await promisify(Writable.prototype.write).call(writable, 'a te', 'utf-8');
        await promisify(Writable.prototype.write).call(writable, 'st of writing', 'utf-8');

        await file.close();

        const str = readFileSync(path, { encoding: 'utf-8' });
        __self.assertEquals('This is a test of writing', str);
    }

    async testFwriteShouldWriteToFile() {
        const file = await new OpenFile(__dirname + '/../fixtures/WRITEFILE', 'w');
        __self.assertEquals(9, await file.fwrite(Buffer.from('TEST FILE')));

        fsyncSync((await file._resource).handle.fd);
        __self.assertEquals(9, await file.getSize());

        await file.close();
    }

    async testFtruncateShouldTruncateToSize() {
        const file = await new OpenFile(__dirname + '/../fixtures/WRITEFILE', 'w');
        await file.ftruncate(0);
        __self.assertEquals(0, await file.getSize());

        await file.close();
    }
}
