import { createReadStream, createWriteStream } from 'fs';
import { dirname, join } from 'path';
import { readFile, stat } from 'fs/promises';
import { promisify } from 'util';
import { tmpdir } from 'os';

const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const streamWrite = promisify(__jymfony.StreamBuffer.prototype.write);

export default class StreamBufferTest extends TestCase {
    __construct() {
        super.__construct();

        /**
         * @type {__jymfony.StreamBuffer}
         *
         * @private
         */
        this._stream = undefined;
    }

    beforeEach() {
        this._stream = new __jymfony.StreamBuffer();
    }

    async testShouldWriteIntoABufferObject() {
        await streamWrite.call(this._stream, 'This is a test', 'utf-8');
        __self.assertEquals(14, this._stream.buffer.length);
        __self.assertGreaterThan(14, this._stream._buffer.length);
    }

    async testShouldBeginToReadFromBeginning() {
        await streamWrite.call(this._stream, 'This is a test', 'utf-8');
        __self.assertEquals(14, this._stream.buffer.length);

        __self.assertEquals('This', this._stream.read(4).toString('utf-8'));
        __self.assertEquals(' is', this._stream.read(3).toString('utf-8'));
        __self.assertEquals(' a ', this._stream.read(3).toString('utf-8'));
        __self.assertEquals('test', this._stream.read(30).toString('utf-8'));
        __self.assertEquals(null, this._stream.read(30));
    }

    async testCouldBeInitializedByExistingBuffer() {
        const buffer = Buffer.from('TESTTEST');
        this._stream = new __jymfony.StreamBuffer(buffer);

        await streamWrite.call(this._stream, 'This is a test', 'utf-8');

        __self.assertEquals('TEST', this._stream.read(4).toString('utf-8'));
        __self.assertEquals('TEST', this._stream.read(4).toString('utf-8'));
        __self.assertEquals('This', this._stream.read(4).toString('utf-8'));
        __self.assertEquals(' is', this._stream.read(3).toString('utf-8'));
        __self.assertEquals(' a ', this._stream.read(3).toString('utf-8'));
        __self.assertEquals('test', this._stream.read(30).toString('utf-8'));
        __self.assertEquals(null, this._stream.read(30));
    }

    async testShouldSupportPipeFromReadableStream() {
        const readStream = createReadStream(__dirname + '/../../fixtures/Stream/LOREM_IPSUM.txt');
        await new Promise((res, rej) => {
            readStream.on('error', rej);
            readStream.on('end', res);

            readStream.pipe(this._stream);
        });

        __self.assertEquals('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla', this._stream.read(70).toString('utf-8'));
    }

    async testCouldPipeIntoWritableStream() {
        const buf = await readFile(__dirname + '/../../fixtures/Stream/LOREM_IPSUM.txt');
        this._stream = new __jymfony.StreamBuffer(buf);

        const fn = join(tmpdir(), 'jymfony_tests', 'streams', 'TESTFILE.txt');
        __jymfony.mkdir(dirname(fn));

        try {
            const writeStream = createWriteStream(fn);
            await new Promise(res => {
                writeStream.on('ready', res);
            });

            await new Promise((res, rej) => {
                this._stream.on('error', rej);
                this._stream.on('end', res);

                this._stream.pipe(writeStream);
            });

            writeStream.close();

            const s = await stat(fn);
            __self.assertEquals(buf.length, s.size);
        } finally {
            const fs = new Filesystem();
            try {
                await fs.remove(dirname(fn));
            } catch {
                // Do nothing.
            }
        }
    }
}
