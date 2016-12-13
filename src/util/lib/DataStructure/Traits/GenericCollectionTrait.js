module.exports = superclass => class GenericCollectionTrait extends superclass {
    isEmpty() {
        return this.length === 0;
    }

    copy() {
        return new this.constructor(this);
    }

    toArray() {
        throw new Error('You must override "toArray" method');
    }

    inspect() {
        return this.toArray();
    }

    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
};
