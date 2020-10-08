declare namespace Jymfony.Component.PropertyAccess {
    import PropertyPathInterface = Jymfony.Contracts.PropertyAccess.PropertyPathInterface;
    import PropertyPathIteratorInterface = Jymfony.Contracts.PropertyAccess.PropertyPathIteratorInterface;

    export class PropertyPathIterator extends implementationOf(PropertyPathIteratorInterface) {
        private _elements: string[];
        private _path: PropertyPathInterface;
        private _index: number;

        /**
         * Constructor.
         */
        __construct(propertyPath: PropertyPathInterface): void;
        constructor(propertyPath: PropertyPathInterface);

        /**
         * @inheritdoc
         */
        next(): IteratorResult<string>;

        /**
         * @inheritdoc
         */
        isIndex(): boolean;

        /**
         * @inheritdoc
         */
        isProperty(): boolean;
    }
}
