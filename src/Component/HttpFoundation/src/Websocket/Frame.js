/**
 * @memberOf Jymfony.Component.HttpFoundation.Websocket
 */
class Frame {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {boolean}
         */
        this.fin = false;

        /**
         * @type {boolean}
         */
        this.rsv1 = false;

        /**
         * @type {boolean}
         */
        this.rsv2 = false;

        /**
         * @type {boolean}
         */
        this.rsv3 = false;

        /**
         * @type {number}
         */
        this.opcode = undefined;

        /**
         * @type {number[]}
         */
        this.mask = undefined;

        /**
         * @type {Buffer}
         */
        this.buffer = Buffer.allocUnsafe(0);
    }

    /**
     * Converts this frame to a Buffer.
     *
     * @returns {Buffer}
     */
    toBuffer() {
        const bufLen = 2 +
            (126 > this.buffer.length ? 0 : 0xFFFF > this.buffer.length ? 2 : 8) +
            (undefined !== this.mask ? 4 : 0)
        ;

        const buf = Buffer.allocUnsafe(bufLen);
        const byte = this.opcode +
            (this.fin ? 0x80 : 0) +
            (this.rsv1 ? 0x40 : 0) +
            (this.rsv2 ? 0x20 : 0) +
            (this.rsv3 ? 0x10 : 0);

        buf.writeUInt8(byte, 0);

        if (126 > this.buffer.length) {
            buf.writeUInt8(this.buffer.length, 1);
        } else if (0xFFFF > this.buffer.length) {
            buf.writeUInt8(126, 1);
            buf.writeUInt16BE(this.buffer.length, 2);
        } else {
            buf.writeUInt8(127, 1);
            buf.writeUIntBE(this.buffer.length, 2, 8);
        }

        const copy = Buffer.allocUnsafe(this.buffer.length);
        this.buffer.copy(copy);

        if (undefined !== this.mask) {
            for (let i = 0; i < copy.length; i++) {
                copy[i] = copy[i] ^ this.mask[i % 4];
            }
        }

        return Buffer.concat([ buf, ...(this.mask || []), copy ]);
    }

    /**
     * Initializes a frame from Buffer.
     *
     * @param {Buffer} buffer
     *
     * @returns {null|[Jymfony.Component.HttpFoundation.Websocket.Frame, Buffer]}
     */
    static fromBuffer(buffer) {
        if (2 >= buffer.length) {
            return null;
        }

        const obj = new __self();
        let headerLen = 2;

        const byte = buffer.readUInt8(0);
        obj.fin = 0x80 === (byte & 0x80);
        obj.rsv1 = 0x40 === (byte & 0x40);
        obj.rsv2 = 0x20 === (byte & 0x20);
        obj.rsv3 = 0x10 === (byte & 0x10);

        obj.opcode = buffer.readUInt8(0) & 0xF;
        const [ masked, length ] = ((byte) => {
            let len = byte & 0x7F;
            switch (len) {
                case 126:
                    len = buffer.readUInt16BE(2);
                    headerLen += 2;
                    break;

                case 127:
                    len = buffer.readUIntBE(2, 8);
                    headerLen += 8;
                    break;
            }

            return [
                0x80 === (byte & 0x80),
                len,
            ];
        })(buffer.readUInt8(1));

        if (buffer.length < (masked ? headerLen + 4 : headerLen)) {
            return null;
        }

        obj.mask = masked ? [ ...buffer.slice(headerLen, headerLen + 4) ] : undefined;
        headerLen += masked ? 4 : 0;

        if (buffer.length < headerLen + length) {
            return null;
        }

        obj.buffer = buffer.slice(headerLen, headerLen + length);
        for (let i = 0; i < obj.buffer.length; i++) {
            obj.buffer[i] = obj.buffer[i] ^ obj.mask[i % 4];
        }

        return [ obj, buffer.slice(headerLen + length) ];
    }
}

module.exports = Frame;
