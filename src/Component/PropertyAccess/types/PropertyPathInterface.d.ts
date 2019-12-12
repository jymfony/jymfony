declare namespace Jymfony.Component.PropertyAccess {
    export class PropertyPathInterface implements Iterable<string> {
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
         * Returns the parent property path.
         *
         * The parent property path is the one that contains the same items as
         * this one except for the last one.
         *
         * If this property path only contains one item, null is returned.
         *
         * @returns The parent path or null
         */
        public readonly parent: PropertyPathInterface | undefined;

        /**
         * Returns a new iterator for this path.
         */
        [Symbol.iterator](): PropertyPathIteratorInterface;

        /**
         * Returns whether the element at the given index is a property.
         *
         * @param index The index in the property path
         *
         * @returns Whether the element at this index is a property
         *
         * @throws {Jymfony.Component.PropertyAccess.Exception.OutOfBoundsException} If the offset is invalid
         */
        isProperty(index: number): boolean;

        /**
         * Returns whether the element at the given index is an array index.
         *
         * @param index The index in the property path
         *
         * @returns Whether the element at this index is an array index
         *
         * @throws {Jymfony.Component.PropertyAccess.Exception.OutOfBoundsException} If the offset is invalid
         */
        isIndex(index: number): boolean

        /**
         * Returns the elements of the property path as array.
         *
         * @returns An array of property/index names
         */
        public readonly elements: string[];

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
