/**
 * @type {WeakMap<object, Object.<*, Map<*, *>>>}
 */
const storage = new WeakMap();
const classSymbol = Symbol('class');

/**
 * Gets (or creates) the storage map for the given target/prop.
 *
 * @param {Function} target
 * @param {null|string|symbol} prop
 * @param {boolean} [create = false]
 *
 * @returns {Map<*, *>}
 */
const getStorage = (target, prop, create = false) => {
    if (! storage.has(target)) {
        storage.set(target, {});
    }

    if (! prop) {
        prop = classSymbol;
    }

    const objStorage = storage.get(target);
    if (undefined === objStorage[prop] && create) {
        objStorage[prop] = new Map();
    }

    return objStorage[prop];
};

class MetadataStorage {
    /**
     * Adds a metadata value for the given key.
     * This allows to use the same annotation multiple time on
     * the same target.
     *
     * @param {*} key
     * @param {*} value
     * @param {Function} target
     * @param {null|string|symbol} [prop]
     */
    static addMetadata(key, value, target, prop = null) {
        const storage = getStorage(target, prop, true);
        const currentValue = storage.get(key);
        if (undefined === currentValue) {
            storage.set(key, [ value ]);
        } else {
            storage.set(key, [ ...currentValue, value ]);
        }
    }

    /**
     * Defines a metadata.
     *
     * @param {*} key
     * @param {*} value
     * @param {Function} target
     * @param {null|string|symbol} [prop]
     */
    static defineMetadata(key, value, target, prop = null) {
        const storage = getStorage(target, prop, true);
        storage.set(key, [ value ]);
    }

    /**
     * Retrieves metadata for target.
     *
     * @param {Function} target
     * @param {null|string|symbol} prop
     */
    static getMetadata(target, prop) {
        const storage = getStorage(target, prop);
        if (! storage) {
            return [];
        }

        return [ ...storage.entries() ].map(
            ([ key, value ]) => 1 === value.length ? [ key, value[0] ] : [ key, value ]
        );
    }
}

module.exports = global.MetadataStorage = MetadataStorage;
