declare namespace Jymfony.Component.HttpFoundation {
    /**
     * Represents an IP address
     */
    export class Ip {
        public static readonly IPV4 = 4;
        public static readonly IPV6 = 6;

        private _type: number;
        private _ip: Buffer;

        /**
         * Constructor.
         */
        __construct(ip: string): void;
        constructor(ip: string);

        /**
         * Returns Ip.IPV4 if containing an IPv4 or Ip.IPV6 if containing an IPv6.
         */
        public readonly type: number;

        /**
         * Checks whether this ip address matches the given CIDR or address.
         */
        match(cidr: string): boolean;

        /**
         * Checks an ip against an array of ips or CIDRs.
         */
        static check(clientIp: string | Ip, ips: string | string[]): boolean;

        /**
         * Returns a string representation of this IP address.
         */
        toString(): string;

        /**
         * Parses an IPv4.
         * Returns a buffer containing the bytes of this ip address.
         */
        private static _parseIPv4(ip: string): Buffer;

        /**
         * Checks if this ip address matches with given address and netmask.
         */
        private _check(address: string, netmask: number): boolean;

        /**
         * Parses an IPv6.
         * Returns a buffer containing the bytes of this ip address.
         */
        private static _parseIPv6(ip: string): Buffer;
    }
}
