const HelperInterface = Jymfony.Component.Templating.Helper.HelperInterface;

/**
 * SlotsHelper manages template slots.
 *
 * @memberOf Jymfony.Component.Templating.Helper
 */
export default class SlotsHelper extends implementationOf(HelperInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Templating.View.View} view
     */
    __construct(view) {
        /**
         * @type {Jymfony.Component.Templating.View.View}
         *
         * @private
         */
        this._view = view;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._openSlots = [];

        /**
         * @type {Object.<string, __jymfony.StreamBuffer>}
         *
         * @private
         */
        this._overwritingSlots = {};
    }

    /**
     * Starts a new slot.
     *
     * This method starts an output buffer that will be
     * closed when the stop() method is called.
     *
     * @param {string} name The slot name
     *
     * @throws {InvalidArgumentException} if a slot with the same name is already started
     */
    start(name) {
        if (-1 !== this._openSlots.indexOf(name)) {
            throw new InvalidArgumentException(__jymfony.sprintf('A slot named "%s" is already started.', name));
        }

        this._openSlots.push(name);
        this._overwritingSlots[name] = this._view._slots[name];
        this._view._slots[name] = new __jymfony.StreamBuffer();
        this._view._currentSlot = name;
    }

    /**
     * Stops a slot.
     *
     * @throws {LogicException} if no slot has been started
     */
    stop() {
        if (0 === this._openSlots.length) {
            throw new LogicException('No slot started.');
        }

        this._openSlots.pop();
        this._view._currentSlot = 0 < this._openSlots.length ? this._openSlots[this._openSlots.length - 1] : undefined;
    }

    /**
     * Returns true if the slot exists.
     *
     * @param {string} name The slot name
     *
     * @returns {boolean}
     */
    has(name) {
        return undefined !== this._view._slots[name];
    }

    /**
     * Outputs a slot.
     *
     * @param {string} name The slot name
     * @param {boolean|string} defaultValue The default slot content
     *
     * @returns {boolean} true if the slot is defined or a default value is present, false otherwise
     */
    async output(name, defaultValue = false) {
        if (! this.has(name)) {
            if (false !== defaultValue) {
                await this._view._out(defaultValue);

                return true;
            }

            return false;
        }

        const slot = this._view._slots[name];
        if (undefined !== slot) {
            await this._view._out(slot.buffer);
        }

        return true;
    }

    /**
     * Returns the canonical name of this helper.
     *
     * @returns {string} The canonical name
     */
    get name() {
        return 'slots';
    }
}
