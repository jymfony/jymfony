declare namespace Jymfony.Component.Uid {
    import Uuid = Jymfony.Component.Uid.Uuid;

    export class NilUuid extends Uuid {
        public static readonly TYPE: number;

        __construct(): void;
        constructor();
    }
}
