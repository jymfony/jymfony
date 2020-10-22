/**
 * @memberOf Jymfony.Contracts.Uid
 */
class UidInterface {
    /**
     * Whether the passed value is valid for the constructor of the current class.
     *
     * @param {string} uid
     *
     * @returns {boolean}
     */
    static isValid(uid) { }

    /**
     * Creates an Uid from an identifier represented in any of the supported formats.
     *
     * @param {string} uid
     *
     * @returns {Jymfony.Contracts.Uid.UidInterface}
     *
     * @throws {InvalidArgumentException} When the passed value is not valid
     */
    static fromString(uid) { }

    /**
     * Returns the identifier as a raw binary string.
     *
     * @returns {Buffer}
     */
    toBuffer() { }

    /**
     * Returns the identifier as a RFC4122 case insensitive string.
     *
     * @returns {string}
     */
    toRfc4122() { }

    /**
     * Returns whether the argument is an Uid and contains the same value as the current instance.
     *
     * @param {UidInterface} other
     *
     * @returns {boolean}
     */
    equals(other) { }

    /**
     * Returns whether the argument is greater than, equal or less than the other instance.
     *
     * @param {UidInterface} other
     *
     * @returns {boolean}
     */
    compare(other) { }

    /**
     * @inheritdoc
     */
    toString() { }

    /**
     * @inheritdoc
     */
    toJSON() { }
}

export default getInterface(UidInterface);
