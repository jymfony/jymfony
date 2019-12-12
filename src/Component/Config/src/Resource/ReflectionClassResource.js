import { existsSync, statSync } from 'fs';
import { createHash } from 'crypto';
import { inspect } from 'util';

const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;

/**
 * @memberOf Jymfony.Component.Config.Resource
 */
export default class ReflectionClassResource extends implementationOf(SelfCheckingResourceInterface) {
    /**
     * Constructor.
     *
     * @param {ReflectionClass} classReflector
     */
    __construct(classReflector) {
        /**
         * @type {string}
         *
         * @private
         */
        this._className = classReflector.name;

        /**
         * @type {ReflectionClass}
         *
         * @private
         */
        this._classReflector = classReflector;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._files = [];

        /**
         * @type {string}
         *
         * @private
         */
        this._hash = undefined;
    }

    /**
     * @inheritdoc
     */
    isFresh(timestamp) {
        if (null === this._hash) {
            this._hash = this._computeHash();
            this._loadFiles(this._classReflector);
        }

        for (const file of this._files) {
            let stat;
            try {
                stat = statSync(file);
            } catch (e) {
                return false;
            }

            if (stat.mtimeMs / 1000 > timestamp) {
                return this._hash === this._computeHash();
            }
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    toString() {
        return 'reflection.' + this._className;
    }

    /**
     * @internal
     */
    __sleep() {
        if (null === this._hash) {
            this._hash = this._computeHash();
            this._loadFiles(this._classReflector);
        }

        return [ '_files', '_className', '_hash' ];
    }

    /**
     * @param {ReflectionClass} Class
     *
     * @private
     */
    _loadFiles(Class) {
        for (const v of Class.interfaces) {
            this._loadFiles(v);
        }

        do {
            const file = Class.filename;
            if (!! file && existsSync(file)) {
                this._files.push(file);
            }

            for (const v of Class.traits) {
                this._loadFiles(v);
            }
        } while ((Class = Class.getParentClass()));
    }

    _computeHash() {
        if (null === this._classReflector) {
            try {
                this._classReflector = new ReflectionClass(this._className);
            } catch (e) {
                // The class does not exist anymore
                return false;
            }
        }

        const hash = createHash('md5');
        for (const info of this._generateSignature(this._classReflector)) {
            hash.update(info);
        }

        return hash.digest().toString('hex');
    }

    /**
     * @param {ReflectionClass} Class
     *
     * @returns {IterableIterator<string>}
     *
     * @private
     */
    * _generateSignature(Class) {
        yield inspect(Class.metadata, { depth: 4 });
        yield Class.docblock;

        const parents = [];
        let p;
        while ((p = Class.getParentClass())) {
            parents.push(p.name);
        }

        yield inspect(parents);
        yield inspect(Class.interfaces.map(r => r.name));
        yield inspect(Class.traits.map(r => r.name));
        yield inspect(Class.properties);

        if (! Class.isInterface) {
            for (const f of Class.fields) {
                const field = Class.getField(f);
                if (field.isPrivate) {
                    continue;
                }

                yield field.isStatic ? '1' : '0';
                yield field.docblock;
                yield f;
            }
        }

        for (const m of Class.methods) {
            const method = Class.getMethod(m);
            yield method.docblock;
            yield inspect(method.metadata, { depth: 4 });
        }
    }
}
