declare namespace Jymfony.Component.Uid {
    import AbstractUid = Jymfony.Component.Uid.AbstractUid;
    import UuidV1 = Jymfony.Component.Uid.UuidV1;
    import UuidV3 = Jymfony.Component.Uid.UuidV3;
    import UuidV4 = Jymfony.Component.Uid.UuidV4;
    import UuidV5 = Jymfony.Component.Uid.UuidV5;
    import UuidV6 = Jymfony.Component.Uid.UuidV6;

    export class Uuid extends AbstractUid {
        public static readonly UUID_TYPE_DEFAULT: number;

        // @ts-ignore
        __construct(uuid: string): void;

        constructor(uuid: string);

        /**
         * @param {string} uuid
         *
         * @returns {Jymfony.Component.Uid.Uuid}
         */
        static fromString(uuid: string): Uuid;

        static v1(): UuidV1;

        static v3(namespace: Uuid, name: string): UuidV3;

        static v4(): UuidV4;

        static v5(namespace: Uuid, name: string): UuidV5;

        static v6(): UuidV6;

        static isValid(uuid: any): boolean;

        toBuffer(): Buffer;

        toRfc4122(): string;

        compare(other: Uuid): number;

        static format(uuid: string, version: number): string;
    }
}
