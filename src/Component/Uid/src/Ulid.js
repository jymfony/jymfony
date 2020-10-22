import { randomBytes } from 'crypto';

const AbstractUid = Jymfony.Component.Uid.AbstractUid;
const BinaryUtil = Jymfony.Component.Uid.BinaryUtil;
const Uuid = Jymfony.Component.Uid.Uuid;

let _time = '';
let _rand = [];

/**
 * A ULID is lexicographically sortable and contains a 48-bit timestamp and 80-bit of crypto-random entropy.
 *
 * @see https://github.com/ulid/spec
 *
 * @memberOf Jymfony.Component.Uid
 */
export default class Ulid extends AbstractUid {
    /**
     * Constructor.
     *
     * @param {string} ulid
     */
    __construct(ulid = undefined) {
        if (undefined === ulid) {
            this._uid = __self.generate();

            return;
        }

        if (! __self.isValid(ulid)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Invalid ULID: "%s".', ulid));
        }

        this._uid = ulid.toUpperCase();
    }

    static isValid(ulid) {
        if (26 !== ulid.length) {
            return false;
        }

        if (ulid.match(/[^0-9ABCDEFGHJKMNPQRSTVWXYZabcdefghjkmnpqrstvwxyz]/)) {
            return false;
        }

        return '7' >= ulid[0];
    }

    /**
     * @inheritdoc
     */
    static fromString(ulid) {
        if (36 === ulid.length && Uuid.isValid(ulid)) {
            ulid = Uuid.fromString(ulid).toBuffer();
        } else if (22 === ulid.length && ! ulid.match(new RegExp('[^' + BinaryUtil.BASE58[''] + ']'))) {
            ulid = BinaryUtil.fromBase(ulid, BinaryUtil.BASE58);
        }

        if (16 !== ulid.length) {
            return new Ulid(ulid);
        }

        if (! isBuffer(ulid)) {
            ulid = Buffer.from(ulid, 'binary');
        }

        ulid = ulid.toString('hex');
        ulid = __jymfony.sprintf('%02s%04s%04s%04s%04s%04s%04s',
            Number.parseInt(ulid.substr(0, 2), 16).toString(32),
            Number.parseInt(ulid.substr(2, 5), 16).toString(32),
            Number.parseInt(ulid.substr(7, 5), 16).toString(32),
            Number.parseInt(ulid.substr(12, 5), 16).toString(32),
            Number.parseInt(ulid.substr(17, 5), 16).toString(32),
            Number.parseInt(ulid.substr(22, 5), 16).toString(32),
            Number.parseInt(ulid.substr(27, 5), 16).toString(32),
        );

        return new Ulid(__jymfony.strtr(ulid, 'abcdefghijklmnopqrstuv', 'ABCDEFGHJKMNPQRSTVWXYZ'));
    }

    toBuffer() {
        let ulid = __jymfony.strtr(this._uid, 'ABCDEFGHJKMNPQRSTVWXYZ', 'abcdefghijklmnopqrstuv');

        ulid = __jymfony.sprintf('%02s%05s%05s%05s%05s%05s%05s',
            Number.parseInt(ulid.substr(0, 2), 32).toString(16),
            Number.parseInt(ulid.substr(2, 4), 32).toString(16),
            Number.parseInt(ulid.substr(6, 4), 32).toString(16),
            Number.parseInt(ulid.substr(10, 4), 32).toString(16),
            Number.parseInt(ulid.substr(14, 4), 32).toString(16),
            Number.parseInt(ulid.substr(18, 4), 32).toString(16),
            Number.parseInt(ulid.substr(22, 4), 32).toString(16),
        );

        return Buffer.from(ulid, 'hex');
    }

    toBase32() {
        return this._uid;
    }

    getTime() {
        const time = __jymfony.strtr(this._uid.substr(0, 10), 'ABCDEFGHJKMNPQRSTVWXYZ', 'abcdefghijklmnopqrstuv');

        return Number.parseInt(time, 32) / 1000;
    }

    /**
     * @returns {string}
     *
     * @private
     */
    static generate(time = String(new Date().getTime())) {
        time = time.substr(11) + time.substr(2, 3);

        if (time !== _time) {
            const r = randomBytes(10);
            let r1 = r.readUInt16BE(0);
            let r2 = r.readUInt16BE(2);
            let r3 = r.readUInt16BE(4);
            let r4 = r.readUInt16BE(6);
            let rr = r.readUInt16BE(8);

            r1 |= (rr <<= 4) & 0xF0000;
            r2 |= (rr <<= 4) & 0xF0000;
            r3 |= (rr <<= 4) & 0xF0000;
            r4 |= (rr <<= 4) & 0xF0000;

            _rand = [ r1, r2, r3, r4 ];
            _time = time;
        } else if (__jymfony.equal([ 0xFFFFF, 0xFFFFF, 0xFFFFF, 0xFFFFF ], _rand)) {
            while (new Date().getTime() !== _time) {
                // Do nothing.
            }

            return __self.generate();
        } else {
            let i = 3;
            for (; 0 <= i && 0xFFFFF === _rand[i]; --i) {
                _rand[i] = 0;
            }

            ++_rand[i];
        }

        time = Number.parseInt(time, 10).toString(32);

        return __jymfony.strtr(__jymfony.sprintf('%010s%04s%04s%04s%04s',
            time,
            _rand[0].toString(32),
            _rand[1].toString(32),
            _rand[2].toString(32),
            _rand[3].toString(32),
        ), 'abcdefghijklmnopqrstuv', 'ABCDEFGHJKMNPQRSTVWXYZ');
    }
}
