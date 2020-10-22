declare namespace Jymfony.Component.Uid {
    import Uuid = Jymfony.Component.Uid.Uuid;

    /**
     * A v6 UUID is lexicographically sortable and contains a 60-bit timestamp and 62 extra unique bits.
     *
     * Unlike UUIDv1, this implementation of UUIDv6 doesn't leak the MAC address of the host.
     */
    export class UuidV6 extends Uuid {
        public static readonly TYPE: number;

        __construct(uuid?: string | null): void;
        constructor(uuid?: string | null);

        getTime(): number;
        getNode(): string;
    }
}
