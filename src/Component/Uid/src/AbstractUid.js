const BinaryUtil = Jymfony.Component.Uid.BinaryUtil;
const UidInterface = Jymfony.Contracts.Uid.UidInterface;
const collator = new Intl.Collator('en');

/**
 * @memberOf Jymfony.Component.Uid
 *
 * @abstract
 */
export default class AbstractUid extends implementationOf(UidInterface) {
    __construct() {
        /**
         * The identifier in its canonic representation.
         *
         * @type {string}
         *
         * @protected
         */
        this._uid = undefined;
    }

    /**
     * @inheritdoc
     */
    toBuffer() {
        throw new Error('toBuffer method must be implemented');
    }

    /**
     * Returns the identifier as a base-58 case sensitive string.
     *
     * @returns {string}
     */
    toBase58() {
        return __jymfony.strtr(
            __jymfony.sprintf('%022s', BinaryUtil.toBase(this.toBuffer(), BinaryUtil.BASE58)),
            { '0': '1' }
        );
    }

    /**
     * Returns the identifier as a base-32 case insensitive string.
     *
     * @returns {string}
     */
    toBase32() {
        let uid = this.toBuffer().toString('hex');
        uid = __jymfony.sprintf('%02s%04s%04s%04s%04s%04s%04s',
            Number.parseInt(uid.substr(0, 2), 16).toString(32),
            Number.parseInt(uid.substr(2, 5), 16).toString(32),
            Number.parseInt(uid.substr(7, 5), 16).toString(32),
            Number.parseInt(uid.substr(12, 5), 16).toString(32),
            Number.parseInt(uid.substr(17, 5), 16).toString(32),
            Number.parseInt(uid.substr(22, 5), 16).toString(32),
            Number.parseInt(uid.substr(27, 5), 16).toString(32),
        );

        return __jymfony.strtr(uid, {
            'a': 'A',
            'b': 'B',
            'c': 'C',
            'd': 'D',
            'e': 'E',
            'f': 'F',
            'g': 'G',
            'h': 'H',
            'i': 'J',
            'j': 'K',
            'k': 'M',
            'l': 'N',
            'm': 'P',
            'n': 'Q',
            'o': 'R',
            'p': 'S',
            'q': 'T',
            'r': 'V',
            's': 'W',
            't': 'X',
            'u': 'Y',
            'v': 'Z',
        });
    }

    /**
     * @inheritdoc
     */
    toRfc4122() {
        const uid = this.toBuffer();

        return __jymfony.sprintf(
            '%s-%s-%s-%s-%s',
            uid.slice(0, 4).toString('hex'),
            uid.slice(4, 6).toString('hex'),
            uid.slice(6, 8).toString('hex'),
            uid.slice(8, 10).toString('hex'),
            uid.slice(10).toString('hex')
        );
    }

    /**
     * @inheritdoc
     */
    equals(other) {
        if (! (other instanceof UidInterface)) {
            return false;
        }

        return this.toString() === other.toString();
    }

    /**
     * @inheritdoc
     */
    compare(other) {
        const otherUid = other.toString();

        return this._uid.length - otherUid.length || collator.compare(this._uid, other._uid);
    }

    /**
     * @inheritdoc
     */
    toString() {
        return this._uid;
    }

    /**
     * @inheritdoc
     */
    toJSON() {
        return this._uid;
    }
}
