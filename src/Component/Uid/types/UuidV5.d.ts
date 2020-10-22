declare namespace Jymfony.Component.Uid {
    import Uuid = Jymfony.Component.Uid.Uuid;

    /**
     * A v5 UUID contains a SHA1 hash of another UUID and a name.
     *
     * Use Uuid::v5() to compute one.
     */
    export class UuidV5 extends Uuid {
        public static readonly TYPE: number;
    }
}
