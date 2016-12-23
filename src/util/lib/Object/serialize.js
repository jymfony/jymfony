'use strict';

global.__jymfony = global.__jymfony || {};

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
        let vals = [];
        for (let [k, v] of __jymfony.getEntries(value)) {
            vals.push(JSON.stringify(k) + ':' + serialize(v));
        }

        return 'A(' + value.length + '):{' + vals.join(';') + (vals.length ? ';' : '') + '}';
    }

    if (isObjectLiteral(value)) {
        let vals = [];
        for (let [k, v] of __jymfony.getEntries(value)) {
            vals.push(serialize(k) + ':' + serialize(v));
        }

        return 'O(' + vals.length + '):{' + vals.join(';') + (vals.length ? ';' : '') + '}';
    }

    let reflClass = new ReflectionClass(value);
    if (! reflClass.name) {
        throw new RuntimeException('Cannot serialize non-autoloaded object (no metadata present for deserialization)');
    }

    let vals = [];
    for (let [k, v] of __jymfony.getEntries(value)) {
        vals.push(serialize(k) + ':' + serialize(v));
    }

    return 'C[' + reflClass.name + ']:{' + vals.join(';') + (vals.length ? ';' : '') + '}';
}

function unserialize(serialized) {
    let i = 0;
    let readData = (length = 1) => {
        let read = serialized.substr(i, length);
        i += Number(length);

        return read;
    };

    let peek = () => {
        return serialized.substr(i, 1);
    };

    let readUntil = (char) => {
        let read = '';

        while (true) {
            let tmp = readData();

            if (tmp === char || tmp === '') {
                return read;
            }

            read += tmp;
        }
    };

    let expect = (char) => {
        let read = readData();
        if (read !== char) {
            throw new Error('Invalid serialized value. Expected ' + char + ', received ' + read);
        }
    };

    let doUnserialize = () => {
        let type = readData();
        let length, ret;
        switch (type) {
            case 'N':
                return null;

            case 'U':
                return undefined;

            case 'B':
                expect(':');
                return readData() == '1';

            case 'D':
                expect('(');
                length = readUntil(')');
                expect(':');

                return Number(readData(length));

            case 'S':
                expect('(');
                length = readUntil(')');
                expect(':');
                return JSON.parse(readData(length));

            case 'A':
                expect('(');
                length = readUntil(')');

                expect(':'); expect('{');

                ret = [];
                ret.length = length;

                while (peek() !== '}') {
                    let key = readUntil(':');
                    ret[key] = doUnserialize();
                    expect(';');
                }

                readData();
                return ret;

            case 'O':
                expect('(');
                length = readUntil(')');

                expect(':'); expect('{');

                ret = {};
                while (peek() !== '}') {
                    let key = doUnserialize();
                    expect(':');

                    ret[key] = doUnserialize();
                    expect(';');
                }

                readData();
                return ret;

            case 'C':
                expect('[');
                let class_ = readUntil(']');

                let reflClass = new ReflectionClass(class_);
                let obj = reflClass.newInstanceWithoutConstructor();

                expect(':'); expect('{');

                while (peek() !== '}') {
                    let key = doUnserialize();
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
    };

    return doUnserialize();
}

global.__jymfony.serialize = serialize;
global.__jymfony.unserialize = unserialize;
