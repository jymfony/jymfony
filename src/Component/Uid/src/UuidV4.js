import { randomBytes } from 'crypto';

const Uuid = Jymfony.Component.Uid.Uuid;

/**
 * A v4 UUID contains a 122-bit random number.
 *
 * @memberOf Jymfony.Component.Uid
 */
export default class UuidV4 extends Uuid {
    /**
     * Constructor.
     *
     * @param {string | null} uuid
     */
    __construct(uuid = null) {
        if (null === uuid) {
            let uuid = randomBytes(16);
            uuid.writeUInt8(uuid.readUInt8(6) & 0x0F | 0x4F, 6);
            uuid.writeUInt8(uuid.readUInt8(8) & 0x3F | 0x80, 8);
            uuid = uuid.toString('hex');

            this._uid = uuid.substr(0, 8) + '-' + uuid.substr(8, 4) + '-' + uuid.substr(12, 4) + '-' + uuid.substr(16, 4) + '-' + uuid.substr(20, 12);
        } else {
            super.__construct(uuid);
        }
    }
}

Object.defineProperty(UuidV4, 'TYPE', { writable: false, configurable: false, enumerable: true, value: 4 });
