import { uuid_create } from './functions/uuid';

const BinaryUtil = Jymfony.Component.Uid.BinaryUtil;
const Uuid = Jymfony.Component.Uid.Uuid;
const UuidV1 = Jymfony.Component.Uid.UuidV1;

let seed = null;

/**
 * A v6 UUID is lexicographically sortable and contains a 60-bit timestamp and 62 extra unique bits.
 *
 * Unlike UUIDv1, this implementation of UUIDv6 doesn't leak the MAC address of the host.
 *
 * @memberOf Jymfony.Component.Uid
 */
export default class UuidV6 extends Uuid {
    /**
     * Constructor.
     *
     * @param {string | null} uuid
     */
    __construct(uuid = null) {
        if (null === uuid) {
            const uuid = uuid_create(UuidV1.TYPE);
            this._uid = uuid.substr(15, 3) + uuid.substr(9, 4) + uuid[0] + '-' + uuid.substr(1, 4) + '-6' + uuid.substr(5, 3) + uuid.substr(18, 6);

            // "uuid_create()" returns a stable "node" that can leak the MAC of the host, but
            // UUIDv6 prefers a truly random number here, let's XOR both to preserve the entropy

            if (null === seed) {
                seed = [ Math.floor(Math.random() * 0x1000000) - 1, Math.floor(Math.random() * 0x1000000) - 1 ];
            }

            const buf = Buffer.from('00' + uuid.substr(24, 6) + '00' + uuid.substr(30), 'hex');
            this._uid += __jymfony.sprintf('%06x%06x',
                (seed[0] ^ buf.readUInt32BE(0)) | 0x010000,
                seed[1] ^ buf.readUInt32BE(4)
            );
        } else {
            super.__construct(uuid);
        }
    }

    getTime() {
        const time = '0' + this._uid.substr(0, 8) + this._uid.substr(9, 4) + this._uid.substr(15, 3);

        return BinaryUtil.timeToFloat(time);
    }

    getNode() {
        return this._uid.substr(24);
    }
}

Object.defineProperty(UuidV6, 'TYPE', { writable: false, configurable: false, enumerable: true, value: 6 });
