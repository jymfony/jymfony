const Hydrator = Jymfony.Component.VarExporter.Internal.Hydrator;
const Reference = Jymfony.Component.VarExporter.Internal.Reference;

/**
 * @memberOf Jymfony.Component.VarExporter.Internal
 */
export default class Exporter {
    /**
     * Prepares an array of values for VarExporter.
     *
     * @param {*[]|Record<*, *>} values
     * @param {Map<*, *>} objectsPool
     * @param {Jymfony.Component.VarExporter.Internal.ValueHolder<int>} objectCount
     *
     * @returns {*}
     */
    static prepare(values, objectsPool, objectCount) {
        values = __jymfony.deepClone(values);

        let k, value;
        for ([ k, value ] of __jymfony.getEntries(values)) {
            const handleValue = () => {
                values[k] = value;
            };

            const prepareValue = (properties, reflector) => {
                const id = objectsPool.size;
                objectsPool.set(value, [ id ]);
                properties = __self.prepare(properties, objectsPool, objectCount);
                ++objectCount.value;
                objectsPool.set(value, [ id, reflector.name, properties, reflector.hasMethod('__wakeup') ? objectCount.value : 0 ]);

                value = new Reference(id);
                handleValue();
            };

            if (isArray(value) || isObjectLiteral(value)) {
                if (0 < Object.keys(value).length) {
                    value = __self.prepare(value, objectsPool, objectCount);
                }

                handleValue();
                continue;
            } else if (! isObject(value)) {
                handleValue();
                continue;
            }

            if (objectsPool.has(value)) {
                objectCount.value++;
                value = new Reference(objectsPool.get(value)[0]);
                handleValue();
                continue;
            }

            const reflector = new ReflectionClass(value);
            let objValue = JSON.parse(JSON.stringify(value));

            if (reflector.hasMethod('__sleep')) {
                const propNames = value.__sleep();
                if (! isArray(propNames)) {
                    process.emitWarning(__jymfony.sprintf('Error while serializing "%s": __sleep should return an array only containing the names of instance-variables to serialize', reflector.name));
                    value = null;
                    handleValue();
                    continue;
                } else {
                    objValue = propNames.reduce((res, val) => {
                        if (undefined === value[val]) {
                            return res;
                        }

                        res[val] = value[val];
                        return res;
                    }, {});
                }
            }

            const properties = { [reflector.name]: {} };
            for (const [ name, v ] of __jymfony.getEntries(objValue)) {
                properties[reflector.name][String(name)] = v;
            }

            prepareValue(properties, reflector);
        }

        return values;
    }

    static export(value, indent = '') {
        switch (true) {
            case isNumber(value): return value.toString();
            case __jymfony.equal(value, [], true): return '[]';
            case __jymfony.equal(value, {}, true): return '{}';
            case false === value: return 'false';
            case true === value: return 'true';
            case null === value: return 'null';
            case undefined === value: return 'undefined';
            case '' === value: return '';
        }

        if (value instanceof Reference) {
            if (0 <= value.id) {
                return 'o[' + value.id + ']';
            }

            return __self.export(value.value, indent);
        }

        const subIndent = indent + '    ';

        if (isString(value)) {
            let code = JSON.stringify(value);

            if (-1 !== value.indexOf('\n') || -1 !== value.indexOf('\r')) {
                code = __jymfony.strtr(code, {
                    '\\r\\n': '\\r\\n" +\n' + subIndent + '"',
                    '\\n': '\\n" +\n' + subIndent + '"',
                    '\\r': '\\r" +\n' + subIndent + '"',
                });
            }

            if (-1 !== code.indexOf('"" + ')) {
                code = code.replace(/"" \+ /g, '');
            }

            if (code.match(/\+\s*""$/)) {
                code = __jymfony.rtrim(code.replace(/\+\s*""$/, ''));
            }

            return code;
        }

        if (isArray(value)) {
            let code = '';
            for (const v of value) {
                code += subIndent + __self.export(v, subIndent) + ',\n';
            }

            return '[\n' + code + indent + ']';
        }

        if (isObjectLiteral(value)) {
            let code = '';
            for (const [ k, v ] of __jymfony.getEntries(value)) {
                code += subIndent;
                code += '[' + __self.export(k, subIndent) + ']: ';
                code += __self.export(v, subIndent) + ',\n';
            }

            return '{\n' + code + indent + '}';
        }

        if (value instanceof Hydrator) {
            return __self.exportHydrator(value, indent, subIndent);
        }

        throw new UnexpectedValueException(__jymfony.sprintf('Cannot export value of type "%s"', isObject(value) ? ReflectionClass.getClassName(value) : typeof value));
    }

    static exportHydrator(value, indent, subIndent) {
        let code = '';
        for (const [ class_, properties ] of __jymfony.getEntries(value.properties)) {
            code += subIndent + '    ' + __self.export(class_) + ': ' + __self.export(properties, subIndent + '    ') + ',\n';
        }

        const objectCode = value.classes.map(class_ => {
            return '(new ReflectionClass(' + JSON.stringify(class_) + ')).newInstanceWithoutConstructor()';
        }).join(',\n    ' + subIndent);

        code = [
            'o = [\n    ' + subIndent + objectCode + '\n' + subIndent + ']',
            __self.export(value.values, subIndent),
            '' !== code ? '{\n' + code + subIndent + '}' : '{}',
            __self.export(value.value, subIndent),
            __self.export(value.wakeups, subIndent),
        ];

        return ReflectionClass.getClassName(value) + '.hydrate(\n' + subIndent + code.join(',\n' + subIndent) + '\n' + indent + ')';
    }
}
