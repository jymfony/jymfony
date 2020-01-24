declare namespace Jymfony.Component.HttpFoundation.Session.Attribute {
    /**
     * This class relates to session attribute storage.
     */
    export class AttributeBag extends implementationOf(AttributeBagInterface) {
        private _name: string;
        private _storageKey: string;
        private _attributes: Record<string, any>;

        /**
         * Constructor.
         *
         * @param storageKey The key used to store attributes in the session
         */
        __construct(storageKey?: string): void;
        constructor(storageKey?: string);

        /**
         * @inheritdoc
         */
        public name: string;

        /**
         * @inheritdoc
         */
        initialize(attributes: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        public readonly storageKey: string;

        /**
         * @inheritdoc
         */
        has(name: string): boolean;

        /**
         * @inheritdoc
         */
        get(name: string, defaultValue?: any): any;

        /**
         * @inheritdoc
         */
        set(name: string, value: any): void;

        /**
         * @inheritdoc
         */
        all(): Record<string, any>;

        /**
         * @inheritdoc
         */
        replace(attributes: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        remove(name: string): any;

        /**
         * @inheritdoc
         */
        clear(): Record<string, any>;

        /**
         * Returns an iterator for attributes.
         *
         * @returns An iterator
         */
        [Symbol.iterator](): IterableIterator<[string, any]>;

        /**
         * Returns the number of attributes.
         *
         * @returns The number of attributes
         */
        public readonly length: number;
    }
}
