const Exporter = Jymfony.Component.VarExporter.Internal.Exporter;
const Hydrator = Jymfony.Component.VarExporter.Internal.Hydrator;
const ValueHolder = Jymfony.Component.VarExporter.Internal.ValueHolder;

const doExport = (value) => {
    if (! isObject(value) && ! ((isArray(value) || isObjectLiteral(value)) && 0 < Object.keys(value).length)) {
        return Exporter.export(value);
    }

    const objectsPool = new Map();
    const objectCount = new ValueHolder(0);
    value = Exporter.prepare([ value ], objectsPool, objectCount)[0];

    const classes = [];
    const values = [];
    let states = {};

    let i = -1;
    for (const v of objectsPool.values()) {
        i++;
        classes.push(v[1]);
        values.push(v[2]);
        const wakeup = v[3];
        if (0 < wakeup) {
            states[wakeup] = i;
        }
    }

    states = Object.ksort(states);

    const properties = {};
    for (const [ i, vars ] of __jymfony.getEntries(values)) {
        for (const [ class_, vals ] of __jymfony.getEntries(vars)) {
            properties[class_] = properties[class_] || {};
            for (const [ name, v ] of __jymfony.getEntries(vals)) {
                properties[class_][name] = properties[class_][name] || {};
                properties[class_][name][i] = v;
            }
        }
    }

    if (0 < classes.length) {
        value = new Hydrator(classes, null, properties, value, Object.values(states));
    }

    return Exporter.export(value, '    ');
};

/**
 * Exports serializable JS values to JS code.
 *
 * @memberOf Jymfony.Component.VarExporter
 */
export default class VarExporter {
    /**
     /**
     * Exports a serializable JS value to JS code.
     *
     * @param {*} value The value to export
     *
     * @returns {string} The value exported as JS code
     */
    static export(value) {
        return '(() => {\n    let o;\n    return ' + doExport(value) + ';\n})();\n';
    }
}
