declare namespace Jymfony.Contracts.Metadata.Exception {
    export class InvalidArgumentException extends global.InvalidArgumentException {
        public static readonly CLASS_DOES_NOT_EXIST = 1;
        public static readonly VALUE_IS_NOT_AN_OBJECT = 2;
        public static readonly NOT_MERGEABLE_METADATA = 3;
        public static readonly INVALID_METADATA_CLASS = 4;

        /**
         * Creates a new instance of InvalidArgumentException with meaningful message.
         */
        static create(reason: number | string, ...args: any[]): InvalidArgumentException;
    }
}
