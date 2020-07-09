import zlib from 'zlib';
const GZIP_MAGIC_NUMBER = Buffer.from([ 0x1f, 0x8b ]);
const END_OF_FILE = Buffer.alloc(1024, 0);

const decodeString = (buffer, start = undefined, end = undefined) => {
    const buf = buffer.slice(start, end);
    const idx = buf.indexOf(0);

    return (-1 !== idx ? buf.slice(0, idx) : buf).toString('binary');
};

const parse256 = (buffer) => {
    const positive = 0x80 === buffer[0];

    // Build up a base-256 tuple from the least sig to the highest
    if (! positive) {
        buffer.map(byte => 0xFF - byte);
    }

    let sum = 0;
    const l = buffer.length;
    for (let i = 0; i < l; i++) {
        sum += buffer[i] * Math.pow(256, i);
    }

    return positive ? sum : -1 * sum;
};

const decodeOct = (buffer, start = undefined, end = undefined) => {
    const buf = buffer.slice(start, end);

    if (buf[0] & 0x80) {
        return parse256(buffer);
    }

    return parseInt(buf.toString(), 8);
};

const TYPES = {
    0: 'file',
    1: 'link',
    2: 'symlink',
    3: 'character-device',
    4: 'block-device',
    5: 'directory',
    6: 'fifo',
    7: 'contiguous-file',
    72: 'pax-header',
    55: 'pax-global-header',
    27: 'gnu-long-link-path',
    28: 'gnu-long-path',
    30: 'gnu-long-path',
};

/**
 * @memberOf App
 */
export default class ArchiveReader {
    /**
     * Constructor.
     *
     * @param {Buffer} buffer
     */
    __construct(buffer) {
        if (0 === buffer.compare(GZIP_MAGIC_NUMBER, 0, 2, 0, 2)) {
            buffer = zlib.gunzipSync(buffer);
        }

        this._buffer = buffer;
        this._files = {};

        let pos = 0;
        while (pos < this._buffer.length) {
            if (0 === this._buffer.compare(END_OF_FILE, 0, 1024, pos, pos + 1024)) {
                break;
            }

            const { size } = this._processHeader(pos);
            const modulo = size % 512;
            pos += 512 + size + (512 - modulo);
        }
    }

    /**
     * Gets the content of the given file.
     *
     * @param {string} name
     *
     * @return {null|Buffer}
     */
    getFile(name) {
        const file = this._files[name];
        if (! file) {
            return null;
        }

        return this._buffer.slice(file.start, file.start + file.size);
    }

    _processHeader(start) {
        const buffer = this._buffer.slice(start, start + 512);
        const typeFlag = 0 === buffer[156] ? 0 : buffer[156] - '0'.charCodeAt(0);

        const name = decodeString(buffer, 0, 100);
        const size = decodeOct(buffer, 124, 136);
        const linkname = 0 === buffer[157] ? null : decodeString(buffer, 157, 257);

        let chkSum = 8 * 32;
        for (let i = 0; 148 > i; ++i) {
            chkSum += buffer[i];
        }
        for (let i = 156; 512 > i; ++i) {
            chkSum += buffer[i];
        }

        if (chkSum !== decodeOct(buffer, 148, 156)) {
            throw new Exception('Archive corrupted');
        }

        const type = TYPES[typeFlag];

        return this._files[name] = {
            start: start + 512,
            size,
            type,
            linkname,
        };
    }
}
