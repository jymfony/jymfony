const DateTime = Jymfony.Component.DateTime.DateTime;
const HeaderUtils = Jymfony.Component.HttpFoundation.HeaderUtils;

/**
 * @memberOf Jymfony.Component.HttpFoundation
 */
class Cookie {
    /**
     * Creates cookie from raw header string.
     *
     * @param {string} cookie
     * @param {boolean} [decode = false]
     *
     * @returns static
     */
    static fromString(cookie, decode = false) {
        let data = {
            expires: 0,
            path: '/',
            domain: undefined,
            secure: false,
            httponly: false,
            raw: ! decode,
            samesite: null,
        };

        const parts = HeaderUtils.split(cookie, ';=');
        const part = parts.shift();

        const name = decode ? decodeURIComponent(part[0]) : part[0];
        const value = part[1] ? (decode ? decodeURIComponent(part[1]) : part[1]) : undefined;

        data = Object.assign({}, data, HeaderUtils.combine(parts));

        if (data['max-age']) {
            data['expires'] = DateTime.unixTime + ~~data['max-age'];
        }

        return new __self(name, value, data.expires, data.path, data.domain, data.secure, data.httponly, data.raw, data.samesite);
    }

    /**
     * @param {string} name The name of the cookie
     * @param {string|null} [value = null] The value of the cookie
     * @param {int|string|Jymfony.Component.DateTime.DateTime} [expire = 0] The time the cookie expires
     * @param {string} [path = '/'] The path on the server in which the cookie will be available on
     * @param {string|undefined} [domain] The domain that the cookie is available to
     * @param {boolean} [secure = false] Whether the cookie should only be transmitted over a secure HTTPS connection from the client
     * @param {boolean} [httpOnly = true] Whether the cookie will be made accessible only through the HTTP protocol
     * @param {boolean} [raw = false] Whether the cookie value should be sent with no url encoding
     * @param {string|null} [sameSite = null] Whether the cookie will be available for cross-site requests
     *
     * @throws \InvalidArgumentException
     */
    __construct(name, value = null, expire = 0, path = '/', domain = undefined, secure = false, httpOnly = true, raw = false, sameSite = null) {
        // From PHP source code
        if (name.match(/[=,; \t\r\n\013\014]/)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The cookie name "%s" contains invalid characters.', name));
        }

        if (! name) {
            throw new InvalidArgumentException('The cookie name cannot be empty.');
        }

        // Convert expiration time to a Unix timestamp
        if (expire instanceof DateTime) {
            expire = expire.timestamp;
        } else if (! isNumber(expire)) {
            try {
                expire = (new DateTime(expire)).timestamp;
            } catch (e) {
                throw new InvalidArgumentException('The cookie expiration time is not valid.');
            }
        }

        this._name = name;
        this._value = value;
        this._domain = domain;
        this._expire = 0 < expire ? ~~expire : 0;
        this._path = path || '/';
        this._secure = secure;
        this._httpOnly = httpOnly;
        this._raw = raw;

        if (null !== sameSite) {
            sameSite = sameSite.toLowerCase();
        }

        if (sameSite !== __self.SAMESITE_LAX && sameSite !== __self.SAMESITE_STRICT) {
            throw new InvalidArgumentException('The "sameSite" parameter value is not valid.');
        }

        this._sameSite = sameSite;
    }

    /**
     * Returns the cookie as a string.
     *
     * @returns {string} The cookie
     */
    toString() {
        let str = (this.raw ? this.name : encodeURIComponent(this.name)) + '=';

        if ('' === this.value) {
            str += 'deleted; expires=' + new DateTime(DateTime.unixTime - 31536001).format('D, d-M-Y H:i:s T') + '; Max-Age=0';
        } else {
            str += this.raw ? this.value : encodeURIComponent(this.value);

            if (0 !== this.expiresTime) {
                str += '; expires=' + new DateTime(this.expiresTime, 'D, d-M-Y H:i:s T') + '; Max-Age=' + this.maxAge;
            }
        }

        if (this.path) {
            str += '; path=' + this.path;
        }

        if (this.domain) {
            str += '; domain=' + this.domain;
        }

        if (true === this.isSecure) {
            str += '; secure';
        }

        if (true === this.isHttpOnly) {
            str += '; httponly';
        }

        if (null !== this.sameSite) {
            str += '; samesite=' + this.sameSite;
        }

        return str;
    }

    /**
     * Gets the name of the cookie.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Gets the value of the cookie.
     *
     * @returns {string}
     */
    get value() {
        return this._value.toString();
    }

    /**
     * Gets the domain that the cookie is available to.
     *
     * @returns {string}
     */
    get domain() {
        return this._domain;
    }

    /**
     * Gets the time the cookie expires.
     *
     * @returns {int}
     */
    get expiresTime() {
        return this._expire;
    }

    /**
     * Gets the max-age attribute.
     *
     * @returns {int}
     */
    get maxAge() {
        const maxAge = this._expire - DateTime.unixTime;

        return 0 >= maxAge ? 0 : maxAge;
    }

    /**
     * Gets the path on the server in which the cookie will be available on.
     *
     * @returns {string}
     */
    get path() {
        return this._path;
    }

    /**
     * Checks whether the cookie should only be transmitted over a secure HTTPS connection from the client.
     *
     * @returns {boolean}
     */
    get isSecure() {
        return this._secure;
    }

    /**
     * Checks whether the cookie will be made accessible only through the HTTP protocol.
     *
     * @returns {boolean}
     */
    get isHttpOnly() {
        return this._httpOnly;
    }

    /**
     * Whether this cookie is about to be cleared.
     *
     * @returns {boolean}
     */
    get isCleared() {
        return this._expire < DateTime.unixTime;
    }

    /**
     * Checks if the cookie value should be sent with no url encoding.
     *
     * @returns {boolean}
     */
    get raw() {
        return this._raw;
    }

    /**
     * Gets the SameSite attribute.
     *
     * @returns {string|null}
     */
    get sameSite() {
        return this._sameSite;
    }
}

Cookie.SAMESITE_LAX = 'lax';
Cookie.SAMESITE_STRICT = 'strict';

module.exports = Cookie;
