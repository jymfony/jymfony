const AttributeBag = Jymfony.Component.HttpFoundation.Session.AttributeBag;
const FlashBag = Jymfony.Component.HttpFoundation.Session.FlashBag;
const SessionInterface = Jymfony.Component.HttpFoundation.Session.SessionInterface;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Session
 */
export default class Session extends implementationOf(SessionInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpFoundation.Session.Storage.SessionStorageInterface} storage
     * @param {Jymfony.Component.HttpFoundation.Session.AttributeBagInterface} [attributeBag = new Jymfony.Component.HttpFoundation.Session.AttributeBag()]
     * @param {Jymfony.Component.HttpFoundation.Session.Flash.FlashBagInterface} [flashBag = new Jymfony.Component.HttpFoundation.Session.Flash.FlashBag()]
     */
    __construct(storage, attributeBag = new AttributeBag(), flashBag = new FlashBag()) {
        /**
         * @type {Jymfony.Component.HttpFoundation.Session.Storage.SessionStorageInterface}
         *
         * @private
         */
        this._storage = storage;

        this._attributesName = attributeBag.name;
        this.registerBag(attributeBag);

        this._flashesName = flashBag.name;
        this.registerBag(flashBag);
    }

    /**
     * @inheritdoc
     */
    start() {
        return this._storage.start();
    }

    /**
     * @inheritdoc
     */
    get id() {
        return this._storage.id;
    }

    /**
     * @inheritdoc
     */
    set id(id) {
        if (id !== this._storage.id) {
            this._storage.id = id;
        }
    }

    /**
     * @inheritdoc
     */
    get name() {
        return this._storage.name;
    }

    /**
     * @inheritdoc
     */
    set name(name) {
        this._storage.name = name;
    }

    /**
     * @inheritdoc
     */
    async invalidate(lifetime = 0) {
        await this._storage.clear();

        return await this.migrate(true, lifetime);
    }

    /**
     * @inheritdoc
     */
    migrate(destroy = false, lifetime = 0) {
        return this._storage.regenerate(destroy, lifetime);
    }

    /**
     * @inheritdoc
     */
    save() {
        return this._storage.save();
    }

    /**
     * @inheritdoc
     */
    has(name) {
        return this.attributesBag.has(name);
    }

    /**
     * @inheritdoc
     */
    get(name, defaultValue = undefined) {
        return this.attributesBag.get(name, defaultValue);
    }

    /**
     * @inheritdoc
     */
    set(name, value) {
        this.attributesBag.set(name, value);
    }

    /**
     * @inheritdoc
     */
    all() {
        return Object.assign({}, this.attributesBag.all());
    }

    /**
     * @inheritdoc
     */
    replace(attributes) {
        this.attributesBag.replace(attributes);
    }

    /**
     * @inheritdoc
     */
    remove(name) {
        this.attributesBag.remove(name);
    }

    /**
     * @inheritdoc
     */
    clear() {
        this.attributesBag.clear();
    }

    /**
     * @inheritdoc
     */
    get started() {
        return this._storage.started;
    }

    /**
     * @inheritdoc
     */
    registerBag(bag) {
        this._storage.registerBag(bag);
    }

    /**
     * @inheritdoc
     */
    getBag(name) {
        return this._storage.getBag(name);
    }

    /**
     * @inheritdoc
     */
    get attributesBag() {
        return this._storage.getBag(this._attributesName);
    }

    /**
     * @inheritdoc
     */
    get flashBag() {
        return this._storage.getBag(this._flashesName);
    }
}
