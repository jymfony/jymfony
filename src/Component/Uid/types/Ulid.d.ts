declare namespace Jymfony.Component.Uid {
    import AbstractUid = Jymfony.Component.Uid.AbstractUid;
    import UidInterface = Jymfony.Contracts.Uid.UidInterface;

    /**
     * A ULID is lexicographically sortable and contains a 48-bit timestamp and 80-bit of crypto-random entropy.
     *
     * @see https://github.com/ulid/spec
     */
    export class Ulid extends AbstractUid {
        /**
         * Constructor.
         *
         * @param {string} ulid
         */
        __construct(ulid?: string): void;
        constructor(ulid?: string);

        static isValid(ulid: string): boolean;

        /**
         * @inheritdoc
         */
        static fromString<T extends UidInterface>(uid: string): T extends Ulid ? T : never;

        toBuffer(): Buffer;
        toBase32(): string;

        getTime(): number;

        private static generate(time?: string): string;
    }
}
