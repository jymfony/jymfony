global.__jymfony = global.__jymfony || {};

/**
 * Get [Key, Value] pairs for an object
 *
 * @param {Object} object
 */
let entries = function * objentries(object) {
    if (Object.getPrototypeOf(object) !== Object.prototype) {
        throw new InvalidArgumentException('Argument 1 is not an object');
    }

    if (Object.entries) {
        yield * Object.entries();
        return;
    }

    for (let key in object) {
        if (! object.hasOwnProperty(key)) {
            continue;
        }

        yield [key, object[key]];
    }
};

global.__jymfony.getEntries = entries;
