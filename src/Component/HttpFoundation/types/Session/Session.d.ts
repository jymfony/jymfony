declare namespace Jymfony.Component.HttpFoundation.Session {
    import AttributeBagInterface = Jymfony.Component.HttpFoundation.Session.Attribute.AttributeBagInterface;
    import FlashBagInterface = Jymfony.Component.HttpFoundation.Session.Flash.FlashBagInterface;
    import SessionStorageInterface = Jymfony.Component.HttpFoundation.Session.Storage.SessionStorageInterface;

    export class Session extends implementationOf(SessionInterface) {
        private _storage: SessionStorageInterface;
        private _attributesName: string;
        private _flashesName: string;

        /**
         * Constructor.
         */
        __construct(storage: SessionStorageInterface, attributeBag?: AttributeBagInterface, flashBag?: FlashBagInterface): void;
        constructor(storage: SessionStorageInterface, attributeBag?: AttributeBagInterface, flashBag?: FlashBagInterface);

        /**
         * @inheritdoc
         */
        start(): Promise<void>;

        /**
         * @inheritdoc
         */
        public id: string;

        /**
         * @inheritdoc
         */
        public name: string;

        /**
         * @inheritdoc
         */
        invalidate(lifetime?: number): Promise<void>;

        /**
         * @inheritdoc
         */
        migrate(destroy?: boolean, lifetime?: number): Promise<void>;

        /**
         * @inheritdoc
         */
        save(): Promise<void>;

        /**
         * @inheritdoc
         */
        has(name: string): boolean;

        /**
         * @inheritdoc
         */
        get(name: string, defaultValue?: any): string | any;

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
        remove(name: string): void;

        /**
         * @inheritdoc
         */
        clear(): void;

        /**
         * @inheritdoc
         */
        public readonly started: boolean;

        /**
         * @inheritdoc
         */
        registerBag(bag: SessionBagInterface): void;

        /**
         * @inheritdoc
         */
        getBag(name: string): SessionBagInterface;

        /**
         * @inheritdoc
         */
        public readonly attributesBag: AttributeBagInterface;

        /**
         * @inheritdoc
         */
        public readonly flashBag: FlashBagInterface;

        /**
         * Returns an iterator for attributes.
         */
        [Symbol.iterator](): IterableIterator<[string, any]>;

        /**
         * Gets the length of the attributes bag.
         */
        public readonly length: number;
    }
}
