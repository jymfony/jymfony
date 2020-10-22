declare namespace Jymfony.Component.Uid {
    import Uuid = Jymfony.Component.Uid.Uuid;

    /**
     * A v3 UUID contains an MD5 hash of another UUID and a name.
     *
     * Use Uuid::v3() to compute one.
     */
    export class UuidV3 extends Uuid {
        public static readonly TYPE: number;
    }
}
