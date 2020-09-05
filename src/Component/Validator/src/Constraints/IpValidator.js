import { isIP, isIPv4, isIPv6 } from 'net';

const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const Ip = Jymfony.Component.Validator.Constraints.Ip;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class IpValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    validate(value, constraint) {
        if (! (constraint instanceof Ip)) {
            throw new UnexpectedTypeException(constraint, Ip);
        }

        if (undefined === value || null === value || '' === value) {
            return;
        }

        value = String(value);
        if (null !== constraint.normalizer) {
            value = constraint.normalizer(value);
        }

        let ipCheck = isIP;
        const valueBuffer = isIPv4(value) ? __self._parseV4(value) : (isIPv6(value) ? __self._parseV6(value) : null);
        switch (constraint.version) {
            case Ip.V4:
                ipCheck = isIPv4;
                break;

            case Ip.V4_NO_PRIV:
                ipCheck = value => isIPv4(value) && ! __self._checkV4Private(valueBuffer);
                break;

            case Ip.V4_NO_RES:
                ipCheck = value => isIPv4(value) && ! __self._checkV4Reserved(valueBuffer);
                break;

            case Ip.V6:
                ipCheck = isIPv6;
                break;

            case Ip.V6_NO_PRIV:
                ipCheck = value => isIPv6(value) && ! __self._checkV6Private(valueBuffer);
                break;

            case Ip.V6_NO_RES:
                ipCheck = value => isIPv6(value) && ! __self._checkV6Reserved(valueBuffer);
                break;

            case Ip.V4_ONLY_PUBLIC:
                ipCheck = value => isIPv4(value) && ! __self._checkV4Private(valueBuffer) && ! __self._checkV4Reserved(valueBuffer);
                break;

            case Ip.V6_ONLY_PUBLIC:
                ipCheck = value => isIPv6(value) && ! __self._checkV6Private(valueBuffer) && ! __self._checkV6Reserved(valueBuffer);
                break;

            case Ip.ALL_NO_PRIV:
                ipCheck = value => {
                    if (isIPv4(value)) {
                        return ! __self._checkV4Private(valueBuffer);
                    } else if (isIPv6(value)) {
                        return ! __self._checkV6Private(valueBuffer);
                    }

                    return false;
                };
                break;

            case Ip.ALL_NO_RES:
                ipCheck = value => {
                    if (isIPv4(value)) {
                        return ! __self._checkV4Reserved(valueBuffer);
                    } else if (isIPv6(value)) {
                        return ! __self._checkV6Reserved(valueBuffer);
                    }

                    return false;
                };
                break;

            case Ip.ALL_ONLY_PUBLIC:
                ipCheck = value => {
                    if (isIPv4(value)) {
                        return ! __self._checkV4Private(valueBuffer) && ! __self._checkV4Reserved(valueBuffer);
                    } else if (isIPv6(value)) {
                        return ! __self._checkV6Private(valueBuffer) && ! __self._checkV6Reserved(valueBuffer);
                    }

                    return false;
                };

                break;
        }

        if (! ipCheck(value)) {
            this._context.buildViolation(constraint.message)
                .setParameter('{{ value }}', this._formatValue(value))
                .setCode(Ip.INVALID_IP_ERROR)
                .addViolation();
        }
    }

    /**
     * Checks if the given value is a reserved ip address
     *
     * @param {Buffer} value
     *
     * @returns {boolean}
     *
     * @private
     */
    static _checkV4Reserved(value) {
        return __self._checkV4(value, '0.0.0.0', 8) ||
            __self._checkV4(value, '100.64.0.0', 10) ||
            __self._checkV4(value, '127.0.0.0', 8) ||
            __self._checkV4(value, '169.254.0.0', 16) ||
            __self._checkV4(value, '192.0.0.0', 24) ||
            __self._checkV4(value, '192.0.2.0', 24) ||
            __self._checkV4(value, '192.88.99.0', 24) ||
            __self._checkV4(value, '198.18.0.0', 15) ||
            __self._checkV4(value, '198.51.100.0', 24) ||
            __self._checkV4(value, '203.0.113.0', 24) ||
            __self._checkV4(value, '224.0.0.0', 4) ||
            __self._checkV4(value, '240.0.0.0', 4) ||
            __self._checkV4(value, '255.255.255.255', 32)
        ;
    }

    /**
     * Checks if the given value is a private ip address
     *
     * @param {Buffer} value
     *
     * @returns {boolean}
     *
     * @private
     */
    static _checkV4Private(value) {
        return __self._checkV4(value, '10.0.0.0', 8) ||
            __self._checkV4(value, '172.16.0.0', 12) ||
            __self._checkV4(value, '192.168.0.0', 16)
        ;
    }

    /**
     * Checks if the given value is a reserved ip address
     *
     * @param {Buffer} value
     *
     * @returns {boolean}
     *
     * @private
     */
    static _checkV6Reserved(value) {
        return __self._checkV6(value, '::1', 128) ||
            __self._checkV6(value, '::', 128) ||
            __self._checkV6(value, '::ffff:0:0', 96) ||
            __self._checkV6(value, '::ffff:0:0:0', 96) ||
            __self._checkV6(value, '64:ff9b::', 96) ||
            __self._checkV6(value, '100::', 64) ||
            __self._checkV6(value, '2001::', 32) ||
            __self._checkV6(value, '2001:20::', 28) ||
            __self._checkV6(value, '2001:db8::', 32) ||
            __self._checkV6(value, '2002::', 16) ||
            __self._checkV6(value, 'fe80::', 10) ||
            __self._checkV6(value, 'ff00::', 8);
    }

    /**
     * Checks if the given value is a private ip address
     *
     * @param {Buffer} value
     *
     * @returns {boolean}
     *
     * @private
     */
    static _checkV6Private(value) {
        return __self._checkV6(value, 'fc00::', 7) ||
            __self._checkV6(value, 'fd00::', 8)
        ;
    }

    static _parseV4(address) {
        const buffer = Buffer.allocUnsafe(4);
        address.split('.').map((byte, idx) => buffer.writeUInt8(~~byte, idx));

        return buffer;
    }

    static _parseV6(address) {
        if (':' === address.charAt(0)) {
            address = '0' + address;
        }

        const buffer = Buffer.allocUnsafe(16);
        const words = address.split(':');
        let position = 0;

        for (let word of words) {
            if (0 === word.length) {
                const str = '\x00'.repeat((8 - words.length + 1) * 2);
                buffer.write(str, position);
                position += str.length;

                continue;
            }

            if (4 > word.length) {
                word = ('0000' + word).substr(-4, 4);
            }

            buffer.writeUInt8(parseInt(word.substr(0, 2), 16), position++);
            buffer.writeUInt8(parseInt(word.substr(2, 2), 16), position++);
        }

        return buffer;
    }

    /**
     * Checks if this ipv4 address matches with given address and netmask.
     *
     * @param {Buffer} value
     * @param {string} address
     * @param {int} netmask
     *
     * @returns {boolean}
     *
     * @private
     */
    static _checkV4(value, address, netmask) {
        return __self._check(value, __self._parseV4(address), netmask);
    }

    /**
     * Checks if this ipv6 address matches with given address and netmask.
     *
     * @param {Buffer} value
     * @param {string} address
     * @param {int} netmask
     *
     * @returns {boolean}
     *
     * @private
     */
    static _checkV6(value, address, netmask) {
        return __self._check(value, __self._parseV6(address), netmask);
    }

    /**
     * @param {Buffer} value
     * @param {Buffer} address
     * @param {int} netmask
     *
     * @returns {boolean}
     *
     * @private
     */
    static _check(value, address, netmask) {
        if (0 > netmask) {
            return false;
        }

        let rem = netmask;
        for (let i = 0, ceil = Math.ceil(netmask / 8); i < ceil; ++i) {
            const a = value.readUInt8(i);
            const b = address.readUInt8(i);

            if (8 <= rem) {
                if (a !== b) {
                    return false;
                }

                rem -= 8;
                continue;
            }

            const left = 8 - rem;
            const mask = (0xff << left) & 0xff;
            return (a & mask) === (b & mask);
        }

        return true;
    }
}
