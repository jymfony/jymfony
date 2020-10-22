import { UUID_TYPE_INVALID, uuid_compare, uuid_is_valid, uuid_type } from './functions/uuid';
import { createHash } from 'crypto';

const AbstractUid = Jymfony.Component.Uid.AbstractUid;
const BinaryUtil = Jymfony.Component.Uid.BinaryUtil;
const NilUuid = Jymfony.Component.Uid.NilUuid;
const Ulid = Jymfony.Component.Uid.Ulid;
const UuidV1 = Jymfony.Component.Uid.UuidV1;
const UuidV3 = Jymfony.Component.Uid.UuidV3;
const UuidV4 = Jymfony.Component.Uid.UuidV4;
const UuidV5 = Jymfony.Component.Uid.UuidV5;
const UuidV6 = Jymfony.Component.Uid.UuidV6;

/**
 * @memberOf Jymfony.Component.Uid
 */
export default class Uuid extends AbstractUid {
    __construct(uuid) {
        const type = uuid_type(uuid);

        if (false === type || UUID_TYPE_INVALID === type || (this.constructor.TYPE || type) !== type) {
            throw new InvalidArgumentException(__jymfony.sprintf('Invalid UUID%s: "%s".', this.constructor.TYPE ? 'v' + this.constructor.TYPE : '', uuid));
        }

        this._uid = __jymfony.strtr(uuid, 'ABCDEF', 'abcdef');
    }

    /**
     * @param {string} uuid
     *
     * @returns {Jymfony.Component.Uid.Uuid}
     */
    static fromString(uuid) {
        if (22 === uuid.length && ! uuid.match(new RegExp('[^' + BinaryUtil.BASE58[''] + ']'))) {
            uuid = BinaryUtil.fromBase(uuid, BinaryUtil.BASE58);
        }

        if (16 === uuid.length) {
            const buffer = Buffer.from(uuid, 'binary');
            uuid = buffer.toString('hex');

            uuid = __jymfony.sprintf(
                '%s-%s-%s-%s-%s',
                uuid.substr(0, 8),
                uuid.substr(8, 4),
                uuid.substr(12, 4),
                uuid.substr(16, 4),
                uuid.substr(20),
            );
        } else if (26 === uuid.length && Ulid.isValid(uuid)) {
            uuid = (new Ulid(uuid)).toRfc4122();
        }

        if (__self !== this || 36 !== uuid.length) {
            return new this(uuid);
        }

        switch (uuid_type(uuid)) {
            case UuidV1.TYPE: return new UuidV1(uuid);
            case UuidV3.TYPE: return new UuidV3(uuid);
            case UuidV4.TYPE: return new UuidV4(uuid);
            case UuidV5.TYPE: return new UuidV5(uuid);
            case UuidV6.TYPE: return new UuidV6(uuid);
            case NilUuid.TYPE: return new NilUuid();
        }

        return new __self(uuid);
    }

    static v1() {
        return new UuidV1();
    }

    static v3(namespace, name) {
        const hash = createHash('md5');
        hash.update(Buffer.from(namespace._uid.replace(/-/g, ''), 'hex'));
        hash.update(name);

        const uuid = hash.digest().toString('binary');

        return new UuidV3(__self.format(uuid, 3));
    }

    static v4() {
        return new UuidV4();
    }

    static v5(namespace, name) {
        const hash = createHash('sha1');
        hash.update(Buffer.from(namespace._uid.replace(/-/g, ''), 'hex'));
        hash.update(name);

        const uuid = hash.digest().toString('binary').substr(0, 16);

        return new UuidV5(__self.format(uuid, 5));
    }

    static v6() {
        return new UuidV6();
    }

    static isValid(uuid) {
        if (__self === this) {
            return uuid_is_valid(uuid);
        }

        return this.TYPE === uuid_type(uuid);
    }

    toBuffer() {
        const uid = this._uid.replace(/-/g, '');

        return Buffer.from(uid, 'hex');
    }

    toRfc4122() {
        return this._uid;
    }

    compare(other) {
        const cmp = uuid_compare(this._uid, other._uid);
        if (false !== cmp) {
            return cmp;
        }

        return super.compare(other);
    }

    /**
     * @param {string} uuid
     * @param {int} version
     *
     * @returns {string}
     */
    static format(uuid, version) {
        const buf = Buffer.from(uuid, 'binary');
        buf.writeUInt8(buf.readUInt8(8) & 0x3F | 0x80, 8);
        uuid = buf.toString('hex');

        return __jymfony.sprintf(
            '%s-%s-%u%s-%s-%s',
            uuid.substr(0, 8),
            uuid.substr(8, 4),
            version,
            uuid.substr(13, 3),
            uuid.substr(16, 4),
            uuid.substr(20)
        );
    }
}

Object.defineProperty(Uuid, 'UUID_TYPE_DEFAULT', { writable: false, enumerable: true, configurable: false, value: 0 });
