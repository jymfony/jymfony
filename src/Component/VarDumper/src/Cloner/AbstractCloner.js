const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const ClonerInterface = Jymfony.Component.VarDumper.Cloner.ClonerInterface;
const Data = Jymfony.Component.VarDumper.Cloner.Data;
const Stub = Jymfony.Component.VarDumper.Cloner.Stub;
const ThrowingCasterException = Jymfony.Component.VarDumper.Exception.ThrowingCasterException;
const defaultCasters = new Map(require('./defaultCasters'));

/**
 * AbstractCloner implements a generic caster mechanism for objects and resources.
 *
 * @memberOf Jymfony.Component.VarDumper.Cloner
 * @abstract
 */
class AbstractCloner extends implementationOf(ClonerInterface) {
    /**
     * Constructor.
     *
     * @param {Map.<Function, Function[]>} casters
     */
    __construct(casters = undefined) {
        /**
         * The maximum number of items to past past the minimum depth in nested structure.
         *
         * @type {int}
         *
         * @protected
         */
        this._maxItems = 2500;

        /**
         * The maximum cloned length for strings.
         *
         * @type {undefined|int}
         *
         * @protected
         */
        this._maxString = undefined;

        /**
         * The minimum tree depth where we are guaranteed to clone all the items. After this
         * depth is reached, only maxItems items will be cloned.
         *
         * @type {int}
         *
         * @private
         */
        this._minDepth = 1;

        /**
         * Class info cache.
         *
         * @type {Object<string, [int, string[], boolean, { file: string }]>}
         *
         * @private
         */
        this._classInfo = {};

        /**
         * Filter.
         *
         * @type {int}
         *
         * @private
         */
        this._filter = 0;

        /**
         * Var casters.
         *
         * @type {Map.<Function, Function[]>}
         *
         * @private
         */
        this._casters = new Map();

        if (undefined === casters) {
            casters = defaultCasters;
        }

        this.addCasters(casters);
    }

    /**
     * Add casters for objects.
     * Maps objects types to a callback.
     *
     * @param {Object.<string|symbol, Function>} casters
     */
    addCasters(casters) {
        for (let [ type, callback ] of __jymfony.getEntries(casters)) {
            const r = new ReflectionClass(type);
            type = r.getConstructor();

            if (! this._casters.has(type)) {
                this._casters.set(type, []);
            }

            this._casters.get(type).push(callback);
        }
    }

    /**
     * Sets the maximum number of items to past past the minimum depth in nested structure.
     *
     * @param {int} maxItems
     */
    set maxItems(maxItems) {
        this._maxItems = ~~maxItems;
    }

    /**
     * Sets the maximum cloned length for strings.
     *
     * @param {undefined|int} maxString
     */
    set maxString(maxString) {
        this._maxString = undefined === maxString ? maxString : ~~maxString;
    }

    /**
     * Sets the minimum tree depth where we are guaranteed to clone all the items.  After this
     * depth is reached, only maxItems items will be cloned.
     *
     * @param {int} minDepth
     */
    set minDepth(minDepth) {
        this._minDepth = ~~minDepth;
    }

    /**
     * Clones a variable.
     *
     * @param {*} variable
     * @param {int} filter
     *
     * @returns {Jymfony.Component.VarDumper.Cloner.Data}
     */
    cloneVar(variable, filter = 0) {
        this._filter = filter;

        return new Data(this._doClone(variable));
    }

    /**
     * Effectively clones the PHP variable.
     *
     * @param {*} variable
     * @returns {Object}
     *
     * @abstract
     * @protected
     */
    _doClone(variable) { // eslint-disable-line no-unused-vars
        throw new LogicException('_doClone method must be overridden');
    }

    /**
     * Casts an object to an array representation.
     *
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub The Stub for the casted object
     * @param {boolean} isNested True if the object is nested in the dumped structure
     *
     * @returns {Object} The object casted as array
     *
     * @protected
     */
    _castObject(stub, isNested) {
        const obj = stub.value;
        let class_ = stub.class_;

        let i, parents, hasDebugInfo, fileInfo;
        if (undefined !== class_ && this._classInfo[class_]) {
            [ i, parents, hasDebugInfo, fileInfo ] = this._classInfo[class_];
        } else {
            const r = new ReflectionClass(class_ || obj);

            if (undefined === class_) {
                class_ = r.getConstructor().name;
            }

            if (class_ && '_' === class_[0] && class_.startsWith('_anonymous_')) {
                const parent = r.getParentClass();
                class_ = parent.name || parent.getConstructor().name;
                class_ += '@anonymous';
            }

            stub.class_ = class_;
            i = 2;
            parents = [ r.getConstructor() ];
            hasDebugInfo = r.hasMethod('__debugInfo');

            let parent = r;
            while ((parent = parent.getParentClass())) {
                parents.push(parent.getConstructor());
                ++i;
            }

            for (const inf of r.interfaces) {
                parents.push(inf.getConstructor());
                ++i;
            }

            parents.push('*');

            fileInfo = r.isSubclassOf(Stub) ? {} : { file: r.filename };

            if (undefined !== class_) {
                this._classInfo[class_] = [ i, parents, hasDebugInfo, fileInfo ];
            }
        }

        stub.attr = Object.assign({}, fileInfo || {}, stub.attr);
        let a = Caster.castObject(obj, hasDebugInfo);

        try {
            while (i--) {
                const p = parents[i];
                if (this._casters.has(p) && 0 < this._casters.get(p).length) {
                    for (const callback of this._casters.get(p)) {
                        a = callback(obj, a, stub, isNested, this._filter);
                    }
                }
            }
        } catch (e) {
            a = Object.assign(a, { [(Stub.TYPE_OBJECT === stub.type ? Caster.PREFIX_VIRTUAL : '') + '⚠']: new ThrowingCasterException(e) });
        }

        return a;
    }
}

module.exports = AbstractCloner;
