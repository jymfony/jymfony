(() => {
    if (undefined !== Array.prototype.values) {
        return;
    }

    const iteratorState = new WeakMap();

    class ArrayIterator {
        /**
         * Constructor.
         *
         * @param {*[]} array
         */
        constructor(array) {
            iteratorState.set(this, {
                array,
                index: 0,
            });
        }

        /**
         * Yields next iterator value.
         *
         * @returns {IteratorReturnResult}
         */
        next() {
            const state = iteratorState.get(this);
            if (state.index >= state.array.length) {
                return {done: true};
            }

            return {value: state.array[state.index++], done: false};
        }
    }

    Object.defineProperty(Array.prototype, 'values', {
        writable: false,
        enumerable: false,
        configurable: false,
        value: function () {
            return new ArrayIterator(this);
        },
    });
})();
