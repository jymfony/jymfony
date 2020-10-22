declare namespace Jymfony.Contracts.Uid {
    export class UidInterface {
        public static readonly definition: Newable<UidInterface>

        /**
         * Whether the passed value is valid for the constructor of the current class.
         */
        static isValid(uid: string): boolean;

        /**
         * Creates an Uid from an identifier represented in any of the supported formats.
         *
         * @throws {InvalidArgumentException} When the passed value is not valid
         */
        static fromString<T extends UidInterface>(uid: string): T;

        /**
         * Returns the identifier as a raw buffer.
         */
        toBuffer(): Buffer;

        /**
         * Returns the identifier as a RFC4122 case insensitive string.
         */
        toRfc4122(): string;

        /**
         * Returns whether the argument is an Uid and contains the same value as the current instance.
         */
        equals(other: UidInterface): boolean;

        /**
         * Returns whether the argument is greater than, equal or less than the other instance.
         *
         * @param {UidInterface} other
         *
         * @returns {boolean}
         */
        compare(other: UidInterface): boolean;

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
