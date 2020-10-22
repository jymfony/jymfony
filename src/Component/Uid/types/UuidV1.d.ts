declare namespace Jymfony.Component.Uid {
    import Uuid = Jymfony.Component.Uid.Uuid;

    export class UuidV1 extends Uuid {
        public static readonly TYPE: number;

        __construct(uuid?: string | null): void;
        constructor(uuid?: string | null);

        getTime(): number;
        getNode(): string;
    }
}
