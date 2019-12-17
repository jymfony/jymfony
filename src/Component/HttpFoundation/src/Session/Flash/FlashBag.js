const FlashBagInterface = Jymfony.Component.HttpFoundation.Session.Flash.FlashBagInterface;

/**
 * FlashBag flash message container.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Session.Flash
 */
export default class FlashBag extends implementationOf(FlashBagInterface) {
    /**
     * Constructor.
     *
     * @param {string} storageKey The key used to store flashes in the session
     */
    __construct(storageKey = '_jymfony_flashes') {
        /**
         * @type {string}
         *
         * @private
         */
        this._name = 'flashes';

        /**
         * @type {string}
         *
         * @private
         */
        this._storageKey = storageKey;

        /**
         * @type {Object.<string, string[]>}
         *
         * @private
         */
        this._flashes = {};
    }

    /**
     * @inheritdoc
     */
    get name() {
        return this._name;
    }

    /**
     * @inheritdoc
     */
    set name(name) {
        this._name = name;
    }

    /**
     * @inheritdoc
     */
    initialize(flashes) {
        this._flashes = flashes;
    }

    /**
     * @inheritdoc
     */
    add(type, message) {
        if (undefined === this._flashes[type]) {
            this._flashes[type] = [];
        }

        this._flashes[type].push(message);
    }

    /**
     * @inheritdoc
     */
    peek(type, defaultValue = []) {
        return this.has(type) ? this._flashes[type] : defaultValue;
    }

    /**
     * @inheritdoc
     */
    peekAll() {
        return { ...this._flashes };
    }

    /**
     * @inheritdoc
     */
    get(type, defaultValue = []) {
        if (! this.has(type)) {
            return defaultValue;
        }

        const retVal = this._flashes[type];
        delete this._flashes[type];

        return retVal;
    }

    /**
     * @inheritdoc
     */
    all() {
        const retVal = this.peekAll();
        this._flashes = {};

        return retVal;
    }

    /**
     * @inheritdoc
     */
    set(type, messages) {
        this._flashes[type] = isArray(messages) ? [ ...messages ] : [ messages ];
    }

    /**
     * @inheritdoc
     */
    setAll(messages) {
        this._flashes = messages;
    }

    /**
     * @inheritdoc
     */
    has(type) {
        return this._flashes.hasOwnProperty(type) && 0 < this._flashes[type].length;
    }

    /**
     * @inheritdoc
     */
    keys() {
        return Object.keys(this._flashes);
    }

    /**
     * @inheritdoc
     */
    get storageKey() {
        return this._storageKey;
    }

    /**
     * @inheritdoc
     */
    clear() {
        return this.all();
    }
}
