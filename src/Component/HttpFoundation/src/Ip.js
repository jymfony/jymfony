const net = require('net');

const checkCache = new WeakMap();
const parseCache = new WeakMap();

/**
 * Represents an IP address
 *
 * @memberOf Jymfony.Component.HttpFoundation
 */
class Ip {
    /**
     * Constructor.
     *
     * @param {string} ip
     */
    __construct(ip) {
        if (! net.isIP(ip)) {
            throw new InvalidArgumentException('Not an IP');
        }

        /**
         * @type {int}
         * @private
         */
        this._type = net.isIPv4(ip) ? __self.IPV4 : __self.IPV6;

        if (parseCache.has(ip)) {
            this._ip = Buffer.from(parseCache[ip]);
        } else {
            /**
             * @type {Buffer}
             * @private
             */
            this._ip = net.isIPv4(ip) ? __self._parseIPv4(ip) : __self._parseIPv6(ip);
            parseCache[ip] = Buffer.from(this._ip);
        }
    }

    /**
     * Returns Ip.IPV4 if containing an IPv4
     * or Ip.IPV6 if containing an IPv6
     *
     * @returns {int}
     */
    get type() {
        return this._type;
    }

    /**
     * Checks whether this ip address matches the given cidr or address
     *
     * @param {string} cidr
     */
    match(cidr) {
        const cacheKey = this._ip.toString('base64') + '-' + cidr;
        if (checkCache.has(cacheKey)) {
            return checkCache[cacheKey];
        }

        const parts = cidr.split('/', 2);
        if (1 === parts.length) {
            parts.push(this._type === __self.IPV4 ? '32' : '128');
        }

        return checkCache[cacheKey] = this._check(parts[0], ~~parts[1]);
    }

    /**
     * Checks an ip against an array of ips or CIDRs.
     *
     * @param {string|Jymfony.Component.HttpFoundation.Ip} clientIp
     * @param {string|[string]} ips
     *
     * @returns {boolean}
     */
    static check(clientIp, ips) {
        if (! isArray(ips)) {
            ips = [ ips ];
        }

        if (! (clientIp instanceof __self)) {
            clientIp = new __self(clientIp);
        }

        for (const ip of ips) {
            if (clientIp.match(ip)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns a string representation of this IP address.
     *
     * @returns {string}
     */
    toString() {
        if (__self.IPV6 === this._type) {
            const words = [];
            for (let i = 0; 8 > i; ++i) {
                words.push(__jymfony.sprintf('%02s%02s',
                    this._ip.readUInt8(i*2).toString(16).toLowerCase(),
                    this._ip.readUInt8(i*2 + 1).toString(16).toLowerCase()
                ));
            }

            return words.join(':');
        }

        const bytes = [];
        for (let i = 0; 4 > i; ++i) {
            bytes.push(this._ip.readUInt8(i).toString());
        }

        return bytes.join('.');
    }

    /**
     * Parses an IPv4.
     * Returns a buffer containing the bytes of this ip address.
     *
     * @param {string} ip
     *
     * @returns {Buffer}
     *
     * @private
     */
    static _parseIPv4(ip) {
        const buffer = Buffer.allocUnsafe(4);
        ip.split('.').map((byte, idx) => buffer.writeUInt8(~~byte, idx));

        return buffer;
    }

    /**
     * Checks if this ip address matches with given address and netmask.
     *
     * @param {string} address
     * @param {int} netmask
     *
     * @returns {boolean}
     *
     * @private
     */
    _check(address, netmask) {
        if (0 > netmask) {
            return false;
        }

        if (this._type === __self.IPV4 && (! net.isIPv4(address) || 32 < netmask)) {
            return false;
        } else if (this._type === __self.IPV6 && (! net.isIPv6(address) || 128 < netmask)) {
            return false;
        }

        address = this._type === __self.IPV4 ? __self._parseIPv4(address) : __self._parseIPv6(address);
        let rem = netmask;
        for (let i = 0, ceil = Math.ceil(netmask / 8); i < ceil; ++i) {
            const a = this._ip.readUInt8(i);
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

    /**
     * Parses an IPv6.
     * Returns a buffer containing the bytes of this ip address.
     *
     * @param {string} ip
     *
     * @returns {Buffer}
     *
     * @private
     */
    static _parseIPv6(ip) {
        if (':' === ip.charAt(0)) {
            ip = '0' + ip;
        }

        const buffer = Buffer.allocUnsafe(16);
        const words = ip.split(':');
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
}

Ip.IPV4 = 4;
Ip.IPV6 = 6;

module.exports = Ip;
