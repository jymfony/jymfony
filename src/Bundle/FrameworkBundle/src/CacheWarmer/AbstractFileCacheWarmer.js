const ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;
const CacheWarmerInterface = Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface;
const JsFileAdapter = Jymfony.Component.Cache.Adapter.JsFileAdapter;
const NullAdapter = Jymfony.Component.Cache.Adapter.NullAdapter;

/**
 * @internal
 * @abstract
 *
 * @memberOf Jymfony.Bundle.FrameworkBundle.CacheWarmer
 */
export default class AbstractFileCacheWarmer extends implementationOf(CacheWarmerInterface) {
    /**
     * @param {string} arrayFile The file where metadata are cached
     */
    __construct(arrayFile) {
        /**
         * @type {string}
         *
         * @private
         */
        this._arrayFile = arrayFile;
    }

    /**
     * @inheritdoc
     */
    get optional() {
        return true;
    }

    /**
     * @inheritdoc
     */
    warmUp(cacheDir) {
        const arrayAdapter = new ArrayAdapter();

        if (! this._doWarmUp(cacheDir, arrayAdapter)) {
            return;
        }

        // the ArrayAdapter stores the values serialized
        // to avoid mutation of the data after it was written to the cache
        // so here we un-serialize the values first
        const values = arrayAdapter.values;
        for (const [ key, val ] of __jymfony.getEntries(values)) {
            values[key] = undefined !== val && null !== val ? __jymfony.unserialize(val) : val;
        }

        this._warmUpArrayAdapter(new JsFileAdapter(this._arrayFile, new NullAdapter()), values);
    }

    /**
     * @param {Jymfony.Component.Cache.Adapter.JsFileAdapter} arrayAdapter
     * @param {Object.<string, *>} values
     *
     * @protected
     */
    _warmUpArrayAdapter(arrayAdapter, values) {
        arrayAdapter.warmUp(values);
    }

    /**
     * @returns {boolean} false if there is nothing to warm-up
     *
     * @protected
     */
    _doWarmUp(cacheDir, arrayAdapter) {
        throw new Error('Must be implemented');
    }
}
