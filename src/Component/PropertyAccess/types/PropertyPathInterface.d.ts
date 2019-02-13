declare namespace Jymfony.Component.PropertyAccess {
    export class PropertyPathInterface {
        /**
         * Returns the path as string.
         */
        toString(): string;

        /**
         * Returns the element at given index.
         *
         * @throws {Jymfony.Component.PropertyAccess.Exception.OutOfBoundsException}
         */
        getElement(index: number): string;

        /**
         * Returns the path length.
         */
        public readonly length: number;

        /**
         * Returns the last element of the path.
         */
        public readonly last: number;
    }
}
