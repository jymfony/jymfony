import '../../lib/Stream/StreamBuffer';
import { createReadStream, createWriteStream } from 'fs';
import { dirname, join } from 'path';
import { readFile, stat } from 'fs/promises';
import { expect } from 'chai';
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
        expect(this._stream.buffer.length).to.be.equal(14);
        expect(this._stream._buffer.length).to.be.greaterThan(14);
    }

    async testShouldBeginToReadFromBeginning() {
        await streamWrite.call(this._stream, 'This is a test', 'utf-8');
        expect(this._stream.buffer.length).to.be.equal(14);

        expect(this._stream.read(4).toString('utf-8')).to.be.equal('This');
        expect(this._stream.read(3).toString('utf-8')).to.be.equal(' is');
        expect(this._stream.read(3).toString('utf-8')).to.be.equal(' a ');
        expect(this._stream.read(30).toString('utf-8')).to.be.equal('test');
        expect(this._stream.read(30)).to.be.equal(null);
    }

    async testCouldBeInitializedByExistingBuffer() {
        const buffer = Buffer.from('TESTTEST');
        this._stream = new __jymfony.StreamBuffer(buffer);

        await streamWrite.call(this._stream, 'This is a test', 'utf-8');

        expect(this._stream.read(4).toString('utf-8')).to.be.equal('TEST');
        expect(this._stream.read(4).toString('utf-8')).to.be.equal('TEST');
        expect(this._stream.read(4).toString('utf-8')).to.be.equal('This');
        expect(this._stream.read(3).toString('utf-8')).to.be.equal(' is');
        expect(this._stream.read(3).toString('utf-8')).to.be.equal(' a ');
        expect(this._stream.read(30).toString('utf-8')).to.be.equal('test');
        expect(this._stream.read(30)).to.be.equal(null);
    }

    async testShouldSupportPipeFromReadableStream() {
        const readStream = createReadStream(__dirname + '/../../fixtures/Stream/LOREM_IPSUM.txt');
        await new Promise((res, rej) => {
            readStream.on('error', rej);
            readStream.on('end', res);

            readStream.pipe(this._stream);
        });

        expect(this._stream.read(70).toString('utf-8')).to.be.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fringilla');
    }

    async testCouldPipeIntoWritableStream() {
        const buf = await readFile(__dirname + '/../../fixtures/Stream/LOREM_IPSUM.txt');
        this._stream = new __jymfony.StreamBuffer(buf);

        const fn = join(tmpdir(), 'jymfony_tests', 'streams', 'TESTFILE.txt');
        __jymfony.mkdir(dirname(fn));

        try {
            const writeStream = createWriteStream(fn);
            await new Promise((res, rej) => {
                this._stream.on('error', rej);
                this._stream.on('end', res);

                this._stream.pipe(writeStream);
            });

            writeStream.close();

            const s = await stat(fn);
            expect(s.size).to.be.equal(buf.length);
        } finally {
            const fs = new Filesystem();
            await fs.remove(dirname(fn));
        }
    }
}
