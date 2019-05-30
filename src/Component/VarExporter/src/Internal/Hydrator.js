/**
 * @memberOf Jymfony.Component.VarExporter.Internal
 */
class Hydrator {
    /**
     * Constructor.
     *
     * @param {*[]} classes
     * @param {*} values
     * @param {*} properties
     * @param {*} value
     * @param {*} wakeups
     */
    __construct(classes, values, properties, value, wakeups) {
        this.classes = classes;
        this.values = values;
        this.properties = properties;
        this.value = value;
        this.wakeups = wakeups;
    }

    static hydrate(objects, values, properties, value, wakeups) {
        for (const [ , vars ] of __jymfony.getEntries(properties)) {
            for (const [ name, values ] of __jymfony.getEntries(vars)) {
                for (const [ i, v ] of __jymfony.getEntries(values)) {
                    objects[i][name] = v;
                }
            }
        }

        for (const [ , v ] of __jymfony.getEntries(wakeups)) {
            objects[v].__wakeup();
        }

        return value;
    }
}

module.exports = Hydrator;
