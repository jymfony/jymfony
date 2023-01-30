declare namespace Jymfony.Component.Messenger {
    import StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

    /**
     * A message wrapped in an envelope with stamps (configurations, markers, ...).
     *
     * @final
     */
    export class Envelope<T extends object = object> {
        private _stamps: Record<string, StampInterface[]>;
        private _message: T;

        __construct(message: T, stamps?: StampInterface[]): void
        constructor(message: T, stamps?: StampInterface[]);

        /**
         * Makes sure the message is in an Envelope and adds the given stamps.
         */
        static wrap<T extends object = object>(message: T, stamps?: StampInterface[]): Envelope<T>;

        /**
         * Adds one or more stamps.
         */
        withStamps(...stamps: StampInterface): this;

        /**
         * Removes all stamps of the given class.
         */
        withoutAllStamps(stampFqcn: string | Newable): this;

        /**
         * Removes all stamps that implement the given type.
         */
        withoutStampsOfType(type: string | Newable): this;

        /**
         * Get the last stamp of the specified stamp class
         *
         * @param {string | Function} stampFqcn
         *
         * @returns {null|Jymfony.Component.Messenger.Stamp.StampInterface}
         */
        last(stampFqcn: string): StampInterface | null;
        last<N>(stampFqcn: Newable<N>): N | null;
        last(stampFqcn: string | Newable): StampInterface | null;

        /**
         * @param {string | Function | null}  [stampFqcn = null]
         *
         * @return {Jymfony.Component.Messenger.Stamp.StampInterface[]|Object.<string, Jymfony.Component.Messenger.Stamp.StampInterface[]>} The stamps for the specified FQCN, or all stamps by their class name
         */
        all(stampFqcn: string): StampInterface[];
        all<N>(stampFqcn: Newable<N>): N[];
        all(): Record<string, StampInterface[]>;
        all(stampFqcn?: string | Newable): StampInterface[] | Record<string, StampInterface[]>;

        public readonly message: T;
    }
}
