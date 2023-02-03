/**
 * A message wrapped in an envelope with stamps (configurations, markers, ...).
 *
 * @memberOf Jymfony.Component.Messenger
 * @final
 */
export default class Envelope {
    /**
     * Constructor.
     *
     * @param {object} message
     * @param {Jymfony.Component.Messenger.Stamp.StampInterface[]} [stamps]
     */
    __construct(message, stamps = []) {
        /**
         * @type {Object.<string, Jymfony.Component.Messenger.Stamp.StampInterface[]>}
         *
         * @private
         */
        this._stamps = {};

        /**
         * @type {object}
         *
         * @private
         */
        this._message = message;

        for (const stamp of stamps) {
            const kl = ReflectionClass.getClassName(stamp);
            if (this._stamps[kl] === undefined) {
                this._stamps[kl] = [];
            }

            this._stamps[kl].push(stamp);
        }
    }

    /**
     * Makes sure the message is in an Envelope and adds the given stamps.
     *
     * @param {Jymfony.Component.Messenger.Envelope|object} message
     * @param {Jymfony.Component.Messenger.Stamp.StampInterface[]} [stamps]
     *
     * @returns {Jymfony.Component.Messenger.Envelope}
     */
    static wrap(message, stamps = []) {
        const envelope = message instanceof __self ? message : new __self(message);

        return envelope.withStamps(...stamps);
    }

    /**
     * Adds one or more stamps.
     *
     * @param {Jymfony.Component.Messenger.Stamp.StampInterface} stamps
     *
     * @returns {Jymfony.Component.Messenger.Envelope}
     */
    withStamps(...stamps) {
        const cloned = __jymfony.clone(this);
        for (const stamp of stamps) {
            const kl = ReflectionClass.getClassName(stamp);

            if (undefined === cloned._stamps[kl]) {
                cloned._stamps[kl] = [ stamp ];
            } else {
                cloned._stamps[kl].push(stamp);
            }
        }

        return cloned;
    }

    /**
     * Removes all stamps of the given class.
     *
     * @param {string | Function} stampFqcn
     *
     * @returns {Jymfony.Component.Messenger.Envelope}
     */
    withoutAllStamps(stampFqcn) {
        stampFqcn = ReflectionClass.exists(stampFqcn) ? ReflectionClass.getClassName(stampFqcn) : stampFqcn;

        const cloned = __jymfony.clone(this);
        delete cloned._stamps[stampFqcn];

        return cloned;
    }

    /**
     * Removes all stamps that implement the given type.
     *
     * @param {string | Function} type
     *
     * @returns {Jymfony.Component.Messenger.Envelope}
     */
    withoutStampsOfType(type) {
        type = ReflectionClass.exists(type) ? ReflectionClass.getClassName(type) : stampFqcn;

        const cloned = __jymfony.clone(this);
        for (const klass of Object.keys(cloned._stamps)) {
            if (klass === type || new ReflectionClass(klass).isInstanceOf(type)) {
                delete cloned._stamps[klass];
            }
        }

        return cloned;
    }

    /**
     * Get the last stamp of the specified stamp class
     *
     * @param {string | Function} stampFqcn
     *
     * @returns {null|Jymfony.Component.Messenger.Stamp.StampInterface}
     */
    last(stampFqcn) {
        stampFqcn = ReflectionClass.exists(stampFqcn) ? ReflectionClass.getClassName(stampFqcn) : stampFqcn;

        return (this._stamps[stampFqcn] || []).reverse()[0] || null;
    }

    /**
     * @param {string | Function | null}  [stampFqcn = null]
     *
     * @return {Jymfony.Component.Messenger.Stamp.StampInterface[]|Object.<string, Jymfony.Component.Messenger.Stamp.StampInterface[]>} The stamps for the specified FQCN, or all stamps by their class name
     */
    all(stampFqcn = null) {
        if (null !== stampFqcn) {
            stampFqcn = ReflectionClass.exists(stampFqcn) ? ReflectionClass.getClassName(stampFqcn) : stampFqcn;
            return [ ...(this._stamps[stampFqcn] || []) ];
        }

        const ret = {};
        for (const [ k, v ] of __jymfony.getEntries(this._stamps)) {
            ret[k] = [ ...v ];
        }

        return ret;
    }

    get message() {
        return this._message;
    }
}
