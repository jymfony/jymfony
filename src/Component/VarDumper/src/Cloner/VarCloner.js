const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const AbstractCloner = Jymfony.Component.VarDumper.Cloner.AbstractCloner;
const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

// Global object ids.
const objectIds = new WeakMap();
let currentObjectId = 1;

/**
 * @memberOf Jymfony.Component.VarDumper.Cloner
 */
export default class VarCloner extends AbstractCloner {
    _doClone(variable) {
        const objectRefs = new Map();

        let len = 1;
        let pos = 0;
        const queue = [ [ variable ] ];
        let currentDepth = 0;
        let currentDepthFinalIndex = 0;
        const minDepth = this._minDepth;
        const maxString = this._maxString;
        const maxItems = this._maxItems;
        let minimumDepthReached = 0 === minDepth;
        let a = null;
        let stub = null;

        for (let i = 0; i < len; ++i) {
            if (i > currentDepthFinalIndex) {
                ++currentDepth;
                currentDepthFinalIndex = len - 1;
                if (currentDepth >= minDepth) {
                    minimumDepthReached = true;
                }
            }

            const vals = queue[i];
            for (const [ k, v ] of __jymfony.getEntries(vals)) {
                switch (true) {
                    case undefined === v:
                    case null === v:
                    case isBoolean(v):
                    case isNumber(v):
                        continue;

                    case isString(v): {
                        if ('' === v) {
                            continue;
                        }

                        let cut;
                        if (0 <= maxString && v[1 + (maxString >> 2)] !== undefined && 0 < (cut = v.length - maxString)) {
                            stub = new Stub();
                            stub.type = Stub.TYPE_STRING;
                            stub.class_ = undefined;
                            stub.attr.cut = cut;
                            stub.value = v.substr(0, maxString);
                        } else {
                            continue;
                        }

                        a = null;
                    } break;

                    case isSymbol(v):
                        stub = new Stub();
                        stub.type = Stub.TYPE_SYMBOL;
                        stub.class_ = undefined;
                        stub.value = v;

                        a = null;
                        break;

                    case isArray(v):
                        if (0 === v.length) {
                            continue;
                        }

                        stub = new Stub();
                        stub.type = Stub.TYPE_ARRAY;
                        stub.class_ = v.length;
                        a = [ ...v ];
                        break;

                    case isFunction(v) && ! v.__self__: {
                        let class_ = Object.prototype.toString.call(v);
                        const matches = class_.match(/^\[object (\w+)\]/);
                        const kind = matches ? matches[1] : 'Function';

                        const functionBody = v.toString().split('\n');
                        const firstLine = functionBody.shift();
                        let pad = Infinity;
                        for (let i = 0; i < functionBody.length; ++i) {
                            const m = functionBody[i].match(/^(\s+)/);
                            if (null === m) {
                                pad = 0;
                                break;
                            }

                            pad = Math.min(m[1].length, pad);
                        }

                        const value = {
                            [Caster.PREFIX_VIRTUAL + 'name']: Object.prototype.hasOwnProperty.call(v, 'name') ? __jymfony.trim(v.name) : '<unknown function>',
                            [Caster.PREFIX_VIRTUAL + 'function']: [ firstLine, ...functionBody.map(line => line.substr(pad)) ].join('\n'),
                        };

                        try {
                            const r = new ReflectionClass(v);

                            class_ = __jymfony.trim(r.name || r.getConstructor().name);
                            value[Caster.PREFIX_VIRTUAL + 'name'] = __jymfony.trim(r.name || r.getConstructor().name || '<unknown function>');
                        } catch (e) {
                            // Do nothing.
                        }

                        stub = new Stub();
                        stub.type = Stub.TYPE_OBJECT;
                        stub.class_ = kind;
                        stub.value = v;
                        a = value;
                    } break;

                    case isFunction(v) && !! v.__self__:
                    case isObject(v): {
                        let h = objectIds.get(v);
                        if (undefined === h) {
                            objectIds.set(v, h = currentObjectId++);
                        }

                        if (! objectRefs.has(h)) {
                            stub = new Stub();
                            stub.type = Stub.TYPE_OBJECT;
                            stub.class_ = isObjectLiteral(v) ? 'Object' : ReflectionClass.getClassName(v);
                            stub.value = v;
                            stub.handle = h;
                            a = this._castObject(stub, 0 < i);
                            if (v !== stub.value) {
                                if (Stub.TYPE_OBJECT !== stub.type || undefined === stub.value) {
                                    break;
                                }

                                objectIds.set(stub.value, h = currentObjectId++);
                                stub.handle = h;
                            }

                            stub.value = undefined;
                            if (0 <= maxItems && maxItems <= pos && minimumDepthReached) {
                                stub.attr.cut = __jymfony.keys(a).length;
                                a = null;
                            }
                        }

                        if (! objectRefs.has(h)) {
                            objectRefs.set(h, stub);
                        } else {
                            stub = objectRefs.get(h);
                            ++stub.refCount;
                            a = null;
                        }
                    } break;
                }

                if (null !== a && 0 < __jymfony.keys(a).length) {
                    if (! minimumDepthReached || 0 > maxItems) {
                        queue[len] = a;
                        stub.attr.position = len++;
                    } else if (pos < maxItems) {
                        if (maxItems < (pos += __jymfony.keys(a).length)) {
                            a = __jymfony.keys(a)
                                .slice(0, maxItems - pos)
                                .reduce((res, k) => (res[k] = a[k], res), {});
                            if (0 <= ~~stub.attr.cut) {
                                stub.attr.cut += pos - maxItems;
                            }
                        }

                        queue[len] = a;
                        stub.attr.position = len++;
                    } else if (0 <= stub.attr.cut) {
                        stub.attr.cut += __jymfony.keys(a).length;
                        stub.attr.position = 0;
                    }
                }

                if (Stub.TYPE_ARRAY === stub.type && stub.attr.cut) {
                    stub = [ stub.attr.cut, stub.attr.position ];
                }

                vals[k] = stub;
            }

            queue[i] = vals;
        }

        return queue;
    }
}
