/**
 * @type {WeakMap<object, Object.<*, Map<*, *>>>}
 */
const storage = new WeakMap();
const classSymbol = Symbol('class');

class MetadataStorage {
    /**
     * Defines a metadata.
     *
     * @param {*} key
     * @param {*} value
     * @param {Function} target
     * @param {null|string|symbol} prop
     */
    static defineMetadata(key, value, target, prop) {
        if (! storage.has(target)) {
            storage.set(target, {});
        }

        if (! prop) {
            prop = classSymbol;
        }

        const objStorage = storage.get(target);
        if (undefined === objStorage[prop]) {
            objStorage[prop] = new Map();
        }

        objStorage[prop].set(key, value);
    }

    /**
     * Retrieves metadata for target.
     *
     * @param {Function} target
     * @param {null|string|symbol} prop
     */
    static getMetadata(target, prop) {
        if (! storage.has(target)) {
            return [];
        }

        if (! prop) {
            prop = classSymbol;
        }

        const objStorage = storage.get(target);
        if (undefined === objStorage[prop]) {
            return [];
        }

        return [ ...objStorage[prop].entries() ];
    }
}

module.exports = global.MetadataStorage = MetadataStorage;
