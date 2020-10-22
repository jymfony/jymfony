declare namespace Jymfony.Component.Uid {
    import UidInterface = Jymfony.Contracts.Uid.UidInterface;

    /**
     * @memberOf Jymfony.Component.Uid
     *
     * @abstract
     */
    export abstract class AbstractUid extends implementationOf(UidInterface) {
        /**
         * The identifier in its canonic representation.
         */
        protected _uid: string;

        __construct(): void;
        constructor();

        /**
         * @inheritdoc
         */
        abstract toBuffer(): Buffer;

        /**
         * Returns the identifier as a base-58 case sensitive string.
         */
        toBase58(): string;

        /**
         * Returns the identifier as a base-32 case insensitive string.
         */
        toBase32(): string;

        /**
         * @inheritdoc
         */
        toRfc4122(): string;

        /**
         * @inheritdoc
         */
        equals(other: any): boolean;

        /**
         * @inheritdoc
         */
        compare(other: AbstractUid): number;

        /**
         * @inheritdoc
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        toJSON(): string;
    }
}
