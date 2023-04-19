'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * @param {*} value
 *
 * @returns {string}
 */
const serialize = (value) => {
    if (null === value) {
        return 'N';
    }

    if (undefined === value) {
        return 'U';
    }

    if (isBoolean(value)) {
        return 'B:' + (value ? '1' : '0');
    }

    if (isNumber(value)) {
        value = JSON.stringify(value);
        return 'D(' + value.length + '):' + value;
    }

    if (isString(value)) {
        value = JSON.stringify(value);
        return 'S(' + value.length + '):' + value;
    }

    if (isBuffer(value)) {
        value = value.toString('hex');
        return 'X(' + value.length + '):' + value;
    }

    if (isArray(value)) {
        const vals = [];
        for (const [ k, v ] of __jymfony.getEntries(value)) {
            vals.push(JSON.stringify(k) + ':' + serialize(v));
        }

        return 'A(' + value.length + '):{' + vals.join(';') + (vals.length ? ';' : '') + '}';
    }

    if (isObjectLiteral(value)) {
        const vals = [];
        for (const [ k, v ] of __jymfony.getEntries(value)) {
            vals.push(serialize(k) + ':' + serialize(v));
        }

        return 'O(' + vals.length + '):{' + vals.join(';') + (vals.length ? ';' : '') + '}';
    }

    if (
        value.constructor === HashTable ||
        value.constructor === BTree ||
        value.constructor === LinkedList ||
        value.constructor === PriorityQueue
    ) {
        return 'T[' + value.constructor.name + '](' + value.length + '):{' +
            value.toArray().map(serialize).join(';') + (value.length ? ';' : '') + '}';
    }

    if (isFunction(value)) {
        throw new RuntimeException('Cannot serialize functions');
    }

    if (value instanceof __Incomplete_Class) {
        throw new RuntimeException('Cannot serialize incomplete classes');
    }

    const reflClass = new ReflectionClass(value);
    if (! reflClass.name) {
        throw new RuntimeException('Cannot serialize non-autoloaded objects (no metadata available for deserialization)');
    }

    const vals = [];
    const properties = value.__sleep instanceof Function ? value.__sleep() : Object.keys(value);

    for (const k of properties) {
        vals.push(serialize(k) + ':' + serialize(value[k]));
    }

    return 'C[' + reflClass.name + ']:{' + vals.join(';') + (vals.length ? ';' : '') + '}';
};

/**
 * @param {string} serialized
 * @param {boolean | string[]} [allowedClasses = true]
 * @param {boolean} [throwOnInvalidClass = true]
 *
 * @returns {*}
 */
const unserialize = (serialized, { allowedClasses = true, throwOnInvalidClass = true } = {}) => {
    serialized = serialized.toString();
    let i = 0;
    const readData = (length = 1) => {
        const read = serialized.substring(i, i + length);
        i += Number(length);

        return read;
    };

    const peek = () => {
        return serialized.substring(i, i + 1);
    };

    const readUntil = (char) => {
        let read = '';

        while (true) {
            const tmp = readData();

            if (tmp === char || '' === tmp) {
                return read;
            }

            read += tmp;
        }
    };

    const expect = (char) => {
        const read = readData();
        if (read !== char) {
            throw new Error('Invalid serialized value. Expected ' + char + ', received ' + read);
        }
    };

    const doUnserialize = () => {
        const type = readData();
        let length, ret;
        switch (type) {
            case 'N': {
                return null;
            }

            case 'U': {
                return undefined;
            }

            case 'B': {
                expect(':');
                return '1' == readData();
            }

            case 'D': {
                expect('(');
                length = readUntil(')');
                expect(':');

                return Number(readData(~~length));
            }

            case 'S': {
                expect('(');
                length = readUntil(')');
                expect(':');
                return JSON.parse(readData(~~length));
            }

            case 'X': {
                expect('(');
                length = readUntil(')');
                expect(':');
                return Buffer.from(readData(~~length), 'hex');
            }

            case 'T': {
                expect('[');
                const class_ = readUntil(']');
                expect('(');
                length = readUntil(')');

                expect(':');
                expect('{');

                const values = [];
                values.length = ~~length;

                let idx = 0;
                while (idx < length) {
                    values[idx++] = doUnserialize();
                    expect(';');
                }

                expect('}');

                let val;
                switch (class_) {
                    case 'HashTable':
                        val = new HashTable();
                        for (const [ key, value ] of values) {
                            val.put(key, value);
                        }

                        return val;

                    case 'LinkedList':
                        val = new LinkedList();
                        for (const value of values) {
                            val.push(value);
                        }

                        return val;

                    case 'BTree':
                        val = new BTree();
                        for (const [ key, value ] of values) {
                            val.push(key, value);
                        }

                        return val;

                    case 'PriorityQueue':
                        val = new PriorityQueue();
                        for (const [ priority, value ] of values) {
                            val.push(value, priority);
                        }

                        return val;
                }

                throw new Error('Invalid serialized value. Unknown structure class ' + class_);
            }

            case 'A': {
                expect('(');
                length = readUntil(')');

                expect(':');
                expect('{');

                ret = [];
                ret.length = ~~length;

                while ('}' !== peek()) {
                    const key = readUntil(':');
                    ret[key] = doUnserialize();
                    expect(';');
                }

                readData();
                return ret;
            }

            case 'O': {
                expect('(');
                length = ~~readUntil(')');

                expect(':');
                expect('{');

                ret = {};
                while ('}' !== peek()) {
                    const key = doUnserialize();
                    expect(':');

                    ret[key] = doUnserialize();
                    expect(';');
                }

                readData();
                return ret;
            }

            case 'C': {
                expect('[');
                const class_ = readUntil(']');

                let obj;
                let reflClass = new ReflectionClass(class_);
                if (true === allowedClasses || (isArray(allowedClasses) && allowedClasses.some(c => reflClass.isInstanceOf(c)))) {
                    obj = reflClass.newInstanceWithoutConstructor();
                } else {
                    if (throwOnInvalidClass) {
                        throw new Error('Invalid serialized value. Unknown or disallowed class ' + class_);
                    }

                    reflClass = new ReflectionClass(__Incomplete_Class);
                    obj = new __Incomplete_Class(class_);
                }

                expect(':');
                expect('{');

                while ('}' !== peek()) {
                    const key = doUnserialize();
                    expect(':');

                    obj[key] = doUnserialize();
                    expect(';');
                }

                readData();

                if (obj.__wakeup instanceof Function) {
                    const retVal = obj.__wakeup();
                    if (undefined !== retVal) {
                        obj = retVal;
                    }
                }

                if (__jymfony.autoload.debug) {
                    Reflect.preventExtensions(obj);
                }

                return obj;
            }
        }
    };

    return doUnserialize();
};

class __Incomplete_Class {
    constructor(className) {
        this.__Class_Name = className;
    }
}

__jymfony.serialize = serialize;
__jymfony.unserialize = unserialize;
