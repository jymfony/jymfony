declare namespace Jymfony.Component.HttpFoundation {
    import DateTime = Jymfony.Component.DateTime.DateTime;

    export class Cookie {
        public static readonly SAMESITE_LAX = 'lax';
        public static readonly SAMESITE_STRICT = 'strict';

        private _name: string;
        private _value: string | null;
        private _domain: string | null | undefined;
        private _expire: number;
        private _path: string;
        private _secure: boolean;
        private _httpOnly: boolean;
        private _raw: boolean;
        private _sameSite: string | null;

        /**
         * Creates cookie from raw header string.
         *
         * @returns static
         */
        static fromString(cookie: string, decode?: boolean): Cookie;

        /**
         * Constructor.
         *
         * @param name The name of the cookie
         * @param [value = null] The value of the cookie
         * @param [expire = 0] The time the cookie expires
         * @param [path = '/'] The path on the server in which the cookie will be available on
         * @param [domain] The domain that the cookie is available to
         * @param [secure = false] Whether the cookie should only be transmitted over a secure HTTPS connection from the client
         * @param [httpOnly = true] Whether the cookie will be made accessible only through the HTTP protocol
         * @param [raw = false] Whether the cookie value should be sent with no url encoding
         * @param [sameSite = null] Whether the cookie will be available for cross-site requests
         *
         * @throws {InvalidArgumentException}
         */
        __construct(name: string, value?: string | null, expire?: number | DateTime, path?: string, domain?: string | undefined, secure?: boolean, httpOnly?: boolean, raw?: boolean, sameSite?: string | null): void;
        constructor(name: string, value?: string | null, expire?: number | DateTime, path?: string, domain?: string | undefined, secure?: boolean, httpOnly?: boolean, raw?: boolean, sameSite?: string | null);

        /**
         * Returns the cookie as a string.
         */
        toString(): string;

        /**
         * Gets the name of the cookie.
         */
        public readonly name: string;

        /**
         * Gets the value of the cookie.
         */
        public readonly value: string;

        /**
         * Gets the domain that the cookie is available to.
         */
        public readonly domain: string;

        /**
         * Gets the time the cookie expires.
         */
        public readonly expiresTime: number;

        /**
         * Gets the max-age attribute.
         */
        public readonly maxAge: number;

        /**
         * Gets the path on the server in which the cookie will be available on.
         */
        public readonly path: string;

        /**
         * Checks whether the cookie should only be transmitted over a secure HTTPS connection from the client.
         */
        public readonly isSecure: boolean;

        /**
         * Checks whether the cookie will be made accessible only through the HTTP protocol.
         */
        public readonly isHttpOnly: boolean;

        /**
         * Whether this cookie is about to be cleared.
         */
        public readonly isCleared: boolean;

        /**
         * Checks if the cookie value should be sent with no url encoding.
         */
        public readonly raw: boolean;

        /**
         * Gets the SameSite attribute.
         */
        public readonly sameSite: string | null;
    }
}
