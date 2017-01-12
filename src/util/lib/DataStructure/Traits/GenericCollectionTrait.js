class GenericCollectionTrait {
    /**
     * Whether the collection is empty.
     *
     * @returns {boolean}
     */
    isEmpty() {
        return 0 === this.length;
    }

    /**
     * Clone the collection.
     *
     * @abstract
     */
    copy() {
        /* istanbul ignore next: abstract method */
        throw new Error('You must override "copy" method');
    }

    /**
     * Returns an array copy of the collection.
     *
     * @abstract
     * @returns {Array}
     */
    toArray() {
        /* istanbul ignore next: abstract method */
        throw new Error('You must override "toArray" method');
    }

    inspect() {
        return this.toArray();
    }

    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
}

module.exports = getTrait(GenericCollectionTrait);
