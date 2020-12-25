declare namespace Jymfony.Component.Testing.Comparator {
    import Comparator = Jymfony.Component.Testing.Comparator.Comparator;

    export class ComparatorFactory {
        private _customComparators: Comparator[];
        private _defaultComparators: Comparator[];

        /**
         * Constructs a new factory.
         */
        __construct(): void;
        constructor();

        /**
         * Returns the correct comparator for comparing two values.
         *
         * @param expected The first value to compare
         * @param actual The second value to compare
         */
        getComparatorFor(expected: any, actual: any): Comparator;

        /**
         * Registers a new comparator.
         *
         * This comparator will be returned by getComparatorFor() if its accept() method
         * returns TRUE for the compared values. It has higher priority than the
         * existing comparators, meaning that its accept() method will be invoked
         * before those of the other comparators.
         *
         * @param comparator The comparator to be registered
         */
        register(comparator: Comparator): void;

        /**
         * Unregisters a comparator.
         *
         * This comparator will no longer be considered by getComparatorFor().
         *
         * @param {Jymfony.Component.Testing.Comparator.Comparator} comparator The comparator to be unregistered
         */
        unregister(comparator: Comparator): void;

        /**
         * Unregisters all non-default comparators.
         */
        reset(): void;

        private registerDefaultComparators(): void;
        private registerDefaultComparator(comparator: Comparator): void;
    }
}
