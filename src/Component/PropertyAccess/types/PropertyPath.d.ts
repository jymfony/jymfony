declare namespace Jymfony.Component.PropertyAccess {
    export class PropertyPath extends implementationOf(PropertyPathInterface) {
        private _elements: string[];

        /**
         * Constructor.
         */
        __construct(propertyPath: string | PropertyPath): void;
        constructor(propertyPath: string | PropertyPath);

        /**
         * @inheritdoc
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        getElement(index: number): string;

        /**
         * @inheritdoc
         */
        public readonly parent: PropertyPathInterface | undefined;

        /**
         * @inheritdoc
         */
        [Symbol.iterator](): PropertyPathIteratorInterface;

        /**
         * @inheritdoc
         */
        isProperty(index: number): boolean;

        /**
         * @inheritdoc
         */
        isIndex(index: number): boolean

        /**
         * @inheritdoc
         */
        public readonly elements: string[];

        /**
         * @inheritdoc
         */
        public readonly length: number;

        /**
         * @inheritdoc
         */
        public readonly last: number;
    }
}
