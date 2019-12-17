declare namespace Jymfony.Component.HttpFoundation.Session.Flash {
    /**
     * FlashBag flash message container.
     */
    export class FlashBag extends implementationOf(FlashBagInterface) {
        private _name: string;
        private _storageKey: string;
        private _flashes: Record<string, string[]>;

        /**
         * Constructor.
         *
         * @param storageKey The key used to store flashes in the session
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
        initialize(flashes: Record<string, string[]>): void;

        /**
         * @inheritdoc
         */
        add(type: string, message: any): void;

        /**
         * @inheritdoc
         */
        peek(type: string, defaultValue?: string[]): string[];

        /**
         * @inheritdoc
         */
        peekAll(): Record<string, string[]>;

        /**
         * @inheritdoc
         */
        get(type: string, defaultValue?: string[]): string[];

        /**
         * @inheritdoc
         */
        all(): Record<string, string[]>;

        /**
         * @inheritdoc
         */
        set(type: string, message: any | any[]): void;

        /**
         * @inheritdoc
         */
        setAll(messages: Record<string, any[]>): void;

        /**
         * @inheritdoc
         */
        has(type: string): boolean;

        /**
         * @inheritdoc
         */
        keys(): string[];

        /**
         * @inheritdoc
         */
        public readonly storageKey: string;

        /**
         * @inheritdoc
         */
        clear(): Record<string, string[]>;
    }
}
