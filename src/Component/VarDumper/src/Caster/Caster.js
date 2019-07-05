/**
 * Helper for filtering out properties in casters.
 *
 * @memberOf Jymfony.Component.VarDumper.Caster
 *
 * @final
 */
class Caster {
    /**
     * Casts objects to arrays and adds the dynamic property prefix.
     *
     * @param {Object} obj The object to cast
     * @param {boolean} hasDebugInfo Whether the __debugInfo method exists on $obj or not
     *
     * @returns {Object} The object-literal-cast of the object, with prefixed dynamic properties
     */
    static castObject(obj, hasDebugInfo = false) {
        let a;

        if (hasDebugInfo) {
            a = obj.__debugInfo();
        } else {
            const r = new ReflectionClass(obj);
            a = __jymfony.deepClone({ ...obj });
            if (! isArray(a) && ! isObject(a)) {
                a = {};
            }

            const fields = [];
            let parent = r;
            do {
                for (const field of parent.fields) {
                    const rf = parent.getField(field);
                    rf.accessible = true;

                    a[rf.name] = rf.getValue(obj);
                    fields.push(rf.name);
                }
            } while ((parent = parent.getParentClass()));

            for (const [ key ] of __jymfony.getEntries(a)) {
                if (-1 === fields.indexOf(key)) {
                    const value = a[key];

                    delete a[key];
                    if (isSymbol(key)) {
                        a[key] = value;
                    } else {
                        a[__self.PREFIX_DYNAMIC + String(key)] = value;
                    }
                }
            }
        }

        return a;
    }

    /**
     * Filters out the specified properties.
     *
     * By default, a single match in the $filter bit field filters properties out, following an "or" logic.
     * When EXCLUDE_STRICT is set, an "and" logic is applied: all bits must match for a property to be removed.
     *
     * @param {Object} a The object containing the properties to filter
     * @param {int} filter A bit field of Caster::EXCLUDE_* constants specifying which properties to filter out
     * @param {string[]} listedProperties List of properties to exclude when Caster::EXCLUDE_VERBOSE is set, and to preserve when Caster::EXCLUDE_NOT_IMPORTANT is set
     *
     * @returns {[Object, int]} The filtered object and the count of the removed properties.
     */
    static filter(a, filter, listedProperties = []) {
        a = __jymfony.clone(a);
        let count = 0;

        for (const [ k, v ] of __jymfony.getEntries(a)) {
            let type = __self.EXCLUDE_STRICT & filter;

            if (null === v || undefined === v) {
                type |= __self.EXCLUDE_NULL & filter;
                type |= __self.EXCLUDE_EMPTY & filter;
            } else if (false === v || '' === v || '0' === v || 0 === v || 0.0 === v || [] === v) {
                type |= __self.EXCLUDE_EMPTY & filter;
            }

            if ((__self.EXCLUDE_NOT_IMPORTANT & filter) && -1 === listedProperties.indexOf(k)) {
                type |= __self.EXCLUDE_NOT_IMPORTANT;
            }

            if ((__self.EXCLUDE_VERBOSE & filter) && -1 !== listedProperties.indexOf(k)) {
                type |= __self.EXCLUDE_VERBOSE;
            }

            if (undefined === k[1] || '\0' !== k[0]) {
                type |= __self.EXCLUDE_PUBLIC & filter;
            } else if ('~' === k[1]) {
                type |= __self.EXCLUDE_VIRTUAL & filter;
            } else if ('+' === k[1]) {
                type |= __self.EXCLUDE_DYNAMIC & filter;
            }

            if ((__self.EXCLUDE_STRICT & filter) ? type === filter : type) {
                delete a[k];
                ++count;
            }
        }

        return [ a, count ];
    }
}

Caster.EXCLUDE_VERBOSE = 1;
Caster.EXCLUDE_NULL = 2;
Caster.EXCLUDE_EMPTY = 4;
Caster.EXCLUDE_NOT_IMPORTANT = 8;
Caster.EXCLUDE_STRICT = 16;
Caster.EXCLUDE_PUBLIC = 32;
Caster.EXCLUDE_DYNAMIC = 64;
Caster.EXCLUDE_VIRTUAL = 128;

Caster.PREFIX_VIRTUAL = '\0~\0';
Caster.PREFIX_DYNAMIC = '\0+\0';

module.exports = Caster;
