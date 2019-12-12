declare namespace Jymfony.Component.PropertyAccess {
    export class PropertyPathIteratorInterface implements MixinInterface, Iterator<string> {
        public static readonly definition: Newable<PropertyPathIteratorInterface>;

        /**
         * @inheritdoc
         */
        next(value?: any): IteratorResult<string>;

        /**
         * Returns whether the current element in the property path is an array
         * index.
         */
        isIndex(): boolean;

        /**
         * Returns whether the current element in the property path is a property
         * name.
         */
        isProperty(): boolean;
    }
}
