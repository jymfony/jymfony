const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const Cursor = Jymfony.Component.VarDumper.Cloner.Cursor;
const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

/**
 * @memberOf Jymfony.Component.VarDumper.Cloner
 */
class Data {
    __construct(data) {
        /**
         * @type {Object}
         *
         * @private
         */
        this._data = data;

        this._position = 0;
        this._key = 0;
        this._maxDepth = 20;
        this._maxItemsPerDepth = -1;
    }

    /**
     * Gets the type of the value.
     *
     * @returns {string}
     */
    get type() {
        const item = this._data[this._position][this._key];

        if (! (item instanceof Stub)) {
            return typeof item;
        }

        if (Stub.TYPE_STRING === item.type) {
            return 'string';
        }

        if (Stub.TYPE_ARRAY === item.type) {
            return 'Array';
        }

        if (Stub.TYPE_OBJECT === item.type) {
            return item.class_;
        }
    }

    /**
     * Gets the value contained in the data.
     *
     * @param {boolean} recursive Whether the value should be resolved recursively or not.
     *
     * @returns {*} A native representation of the original value.
     */
    getValue(recursive = false) {
        const item = this._getStub(this._data[this._position][this._key]);

        if (! (item instanceof Stub)) {
            return item;
        }

        if (Stub.TYPE_STRING === item.type) {
            return item.value;
        }

        let children = item.attr.position ? this._data[item.attr.position] : [];
        if (isArray(children)) {
            children = [ ...children ];
        } else {
            children = { ...children };
        }

        for (let [ k, v ] of __jymfony.getEntries(children)) {
            if (recursive && !(v = this._getStub(v) instanceof Stub)) {
                continue;
            }

            children[k] = __jymfony.clone(this);
            children[k]._data = __jymfony.deepClone(children[k]._data);
            children[k]._key = k;
            children[k]._position = item.attr.position;

            if (recursive) {
                children[k] = children[k].getValue(recursive);
            }
        }

        return children;
    }

    get length() {
        return __jymfony.keys(this.getValue()).length;
    }

    /**
     * Seeks to a specific key in nested data structures.
     *
     * @param {string|int} key
     *
     * @returns {Jymfony.Component.VarDumper.Cloner.Data|null} A clone of this Data or null if the key is not set.
     */
    seek(key) {
        const item = this._getStub(this._data[this._position][this._key]);

        if (! (item instanceof Stub) || ! item.attr.position) {
            return null;
        }

        const keys = [ key ];

        switch (item.type) {
            case Stub.TYPE_OBJECT:
                keys.push(Caster.PREFIX_DYNAMIC + key);
                keys.push(Caster.PREFIX_VIRTUAL + key);
                break;

            case Stub.TYPE_ARRAY:
                break;

            default:
                return null;
        }

        let data = null;
        const children = this._data[item.attr.position];

        for (const key of keys) {
            if (children.hasOwnProperty(key)) {
                data = __jymfony.clone(this);
                data._data = __jymfony.deepClone(data._data);
                data._key = key;
                data._position = item.attr.position;
                break;
            }
        }

        return data;
    }

    dump(dumper) {
        const refs = { 0: 0 };
        this._dumpItem(dumper, new Cursor(), refs, this._data[this._position][this._key]);
    }

    [Symbol.iterator]() {
        const value = this.getValue();
        if (isArray(value) || isObjectLiteral(value)) {
            return __jymfony.getEntries(value);
        }

        throw new LogicException(__jymfony.sprintf('%s object holds non-iterable type "%s".', ReflectionClass.getClassName(this), typeof value));
    }

    toString() {
        const value = this.getValue();

        if (! isArray(value) && ! isObject(value)) {
            return String(value);
        }

        return __jymfony.sprintf('%s (count=%d)', this.type, __jymfony.keys(value).length);
    }


    /**
     * Returns a depth limited clone of $this.
     *
     * @param {int} maxDepth The max dumped depth level
     *
     * @returns {Jymfony.Component.VarDumper.Cloner.Data} A clone of this
     */
    withMaxDepth(maxDepth) {
        const data = __jymfony.clone(this);
        data._data = __jymfony.deepClone(data._data);
        data._maxDepth = ~~maxDepth;

        return data;
    }

    /**
     * Limits the number of elements per depth level.
     *
     * @param {int} maxItemsPerDepth The max number of items dumped per depth level
     *
     * @returns {Jymfony.Component.VarDumper.Cloner.Data} A clone of this
     */
    withMaxItemsPerDepth(maxItemsPerDepth) {
        const data = __jymfony.clone(this);
        data._data = __jymfony.deepClone(data._data);
        data._maxItemsPerDepth = ~~maxItemsPerDepth;

        return data;
    }

    /**
     * Depth-first dumping of items.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.DumperInterface} dumper
     * @param {Jymfony.Component.VarDumper.Cloner.Cursor} cursor
     * @param {*[]} refs
     * @param {*} item
     *
     * @private
     */
    _dumpItem(dumper, cursor, refs, item) {
        cursor.refIndex = 0;
        cursor.softRefTo = 0;

        let firstSeen = true;
        if (! (item instanceof Stub)) {
            cursor.attr = {};
            if (item && isArray(item)) {
                item = this._getStub(item);
            }
        }

        if (item instanceof Stub) {
            if (item.refCount) {
                const ref = item.handle;
                if (refs[ref] !== undefined) {
                    cursor.refIndex = refs[ref] = (cursor.refIndex || ++refs[0]);
                } else {
                    firstSeen = false;
                }

                cursor.softRefTo = refs[ref];
            }

            cursor.softRefCount = item.refCount;
            cursor.attr = item.attr;
            let cut = item.attr.cut;

            let children;
            if (item.attr.position && firstSeen) {
                children = this._data[item.attr.position];

                if (cursor.stop) {
                    if (0 <= cut) {
                        cut += __jymfony.keys(children).length;
                    }

                    children = {};
                }
            } else {
                children = {};
            }

            switch (item.type) {
                case Stub.TYPE_STRING:
                    dumper.dumpString(cursor, item.value, cut);
                    break;

                case Stub.TYPE_ARRAY:
                case Stub.TYPE_OBJECT: {
                    let withChildren = 0 < __jymfony.keys(children).length && cursor.depth !== this._maxDepth && this._maxItemsPerDepth;
                    dumper.enterHash(cursor, item.type, item.class_, withChildren);
                    if (withChildren) {
                        if (cursor.skipChildren) {
                            withChildren = false;
                            cut = -1;
                        } else {
                            cut = this._dumpChildren(dumper, cursor, refs, children, cut, item.type);
                        }
                    }

                    cursor.skipChildren = false;
                    dumper.leaveHash(cursor, item.type, item.class, withChildren, cut);
                } break;

                default:
                    throw new RuntimeException(__jymfony.sprintf('Unexpected stub type: %s', item.type));
            }
        } else if (isArray(item)) {
            dumper.enterHash(cursor, Stub.TYPE_ARRAY, null, false);
            dumper.leaveHash(cursor, Stub.TYPE_ARRAY, null, false, 0);
        } else if (isString(item)) {
            dumper.dumpString(cursor, item, 0);
        } else {
            dumper.dumpScalar(cursor, typeof item, item);
        }
    }

    /**
     * Dumps children of hash structures.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.DumperInterface} dumper
     * @param {Jymfony.Component.VarDumper.Cloner.Cursor} parentCursor
     * @param {*[]} refs
     * @param {*} children
     * @param {int} cut
     * @param {int} type
     *
     * @returns {int}
     *
     * @private
     */
    _dumpChildren(dumper, parentCursor, refs, children, cut, type) {
        const cursor = __jymfony.clone(parentCursor);
        ++cursor.depth;
        cursor.hashType = type;
        cursor.hashIndex = 0;
        cursor.hashLength = __jymfony.keys(children).length;
        cursor.hashCut = cut;
        for (const [ key, child ] of __jymfony.getEntries(children)) {
            cursor.hashKey = key;
            this._dumpItem(dumper, cursor, refs, child);
            if (++cursor.hashIndex === this._maxItemsPerDepth || cursor.stop) {
                parentCursor.stop = true;

                return 0 <= cut ? cut + cursor.hashLength - cursor.hashIndex : cut;
            }
        }

        return cut;
    }

    _getStub(item) {
        if (! item || ! isArray(item) || ! isObjectLiteral(item)) {
            return item;
        }

        const stub = new Stub();
        stub.type = Stub.TYPE_ARRAY;
        for ([ stub.class_, stub.attr.position ] of __jymfony.getEntries(item)) { }

        if (item[0]) {
            stub.attr.cut = item[0];
        }

        stub.value = stub.attr.cut + (stub.attr.position ? __jymfony.keys(this._data[stub.attr.position]).length : 0);

        return stub;
    }
}

module.exports = Data;
