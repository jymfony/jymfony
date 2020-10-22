declare namespace Jymfony.Component.Uid {
    import Uuid = Jymfony.Component.Uid.Uuid;

    /**
     * A v4 UUID contains a 122-bit random number.
     */
    export class UuidV4 extends Uuid {
        public static readonly TYPE: number;

        __construct(uuid?: string | null): void;
        constructor(uuid?: string | null);
    }
}
