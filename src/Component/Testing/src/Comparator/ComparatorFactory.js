const ArrayComparator = Jymfony.Component.Testing.Comparator.ArrayComparator;
const NumericComparator = Jymfony.Component.Testing.Comparator.NumericComparator;
const ScalarComparator = Jymfony.Component.Testing.Comparator.ScalarComparator;
const TypeComparator = Jymfony.Component.Testing.Comparator.TypeComparator;

/**
 * @memberOf Jymfony.Component.Testing.Comparator
 */
export default class ComparatorFactory {
    /**
     * Constructs a new factory.
     */
    __construct() {
        /**
         * @type {Jymfony.Component.Testing.Comparator.Comparator[]}
         *
         * @private
         */
        this._customComparators = [];

        /**
         * @type {Jymfony.Component.Testing.Comparator.Comparator[]}
         *
         * @private
         */
        this._defaultComparators = [];

        this.registerDefaultComparators();
    }

    /**
     * Returns the correct comparator for comparing two values.
     *
     * @param {*} expected The first value to compare
     * @param {*} actual The second value to compare
     *
     * @returns {Jymfony.Component.Testing.Comparator.Comparator}
     */
    getComparatorFor(expected, actual) {
        for (const comparator of this._customComparators) {
            if (comparator.accepts(expected, actual)) {
                return comparator;
            }
        }

        for (const comparator of this._defaultComparators) {
            if (comparator.accepts(expected, actual)) {
                return comparator;
            }
        }
    }

    /**
     * Registers a new comparator.
     *
     * This comparator will be returned by getComparatorFor() if its accept() method
     * returns TRUE for the compared values. It has higher priority than the
     * existing comparators, meaning that its accept() method will be invoked
     * before those of the other comparators.
     *
     * @param {Jymfony.Component.Testing.Comparator.Comparator} comparator The comparator to be registered
     */
    register(comparator) {
        this._customComparators.unshift(comparator);
    }

    /**
     * Unregisters a comparator.
     *
     * This comparator will no longer be considered by getComparatorFor().
     *
     * @param {Jymfony.Component.Testing.Comparator.Comparator} comparator The comparator to be unregistered
     */
    unregister(comparator) {
        const idx = this._customComparators.indexOf(comparator);
        if (-1 !== idx) {
            this._customComparators.splice(idx, 1);
        }
    }

    /**
     * Unregisters all non-default comparators.
     */
    reset() {
        this._customComparators = [];
    }

    registerDefaultComparators() {
        // $this->registerDefaultComparator(new MockObjectComparator);
        // $this->registerDefaultComparator(new DateTimeComparator);
        // $this->registerDefaultComparator(new DOMNodeComparator);
        // $this->registerDefaultComparator(new SplObjectStorageComparator);
        // $this->registerDefaultComparator(new ExceptionComparator);
        // $this->registerDefaultComparator(new ObjectComparator);
        // $this->registerDefaultComparator(new ResourceComparator);
        this.registerDefaultComparator(new ArrayComparator(this));
        // $this->registerDefaultComparator(new DoubleComparator);
        this.registerDefaultComparator(new NumericComparator());
        this.registerDefaultComparator(new ScalarComparator());
        this.registerDefaultComparator(new TypeComparator());
    }

    registerDefaultComparator(comparator) {
        this._defaultComparators.push(comparator);
    }
}
