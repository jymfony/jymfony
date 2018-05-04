'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * @param {*} value
 *
 * @returns {string}
 */
function serialize(value) {
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

    const reflClass = new ReflectionClass(value);
    if (! reflClass.name) {
        throw new RuntimeException('Cannot serialize non-autoloaded object (no metadata present for deserialization)');
    }

    const vals = [];
    const properties = value.__sleep instanceof Function ? value.__sleep() : Object.keys(value);

    for (const k of properties) {
        vals.push(serialize(k) + ':' + serialize(value[k]));
    }

    return 'C[' + reflClass.name + ']:{' + vals.join(';') + (vals.length ? ';' : '') + '}';
}

/**
 * @param {string} serialized
 */
function unserialize(serialized) {
    serialized = serialized.toString();
    let i = 0;
    const readData = (length = 1) => {
        const read = serialized.substr(i, length);
        i += Number(length);

        return read;
    };

    const peek = () => {
        return serialized.substr(i, 1);
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

                return Number(readData(length));
            }

            case 'S': {
                expect('(');
                length = readUntil(')');
                expect(':');
                return JSON.parse(readData(length));
            }

            case 'A': {
                expect('(');
                length = readUntil(')');

                expect(':');
                expect('{');

                ret = [];
                ret.length = length;

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
                length = readUntil(')');

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

                const reflClass = new ReflectionClass(class_);
                const obj = reflClass.newInstanceWithoutConstructor();

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
                    obj.__wakeup();
                }

                return obj;
            }
        }
    };

    return doUnserialize();
}

global.__jymfony.serialize = serialize;
global.__jymfony.unserialize = unserialize;
