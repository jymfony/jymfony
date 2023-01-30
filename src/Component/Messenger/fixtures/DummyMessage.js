/**
 * @memberOf Jymfony.Component.Messenger.Fixtures
 */
export default class DummyMessage extends implementationOf(Jymfony.Component.Messenger.Fixtures.DummyMessageInterface) {
    /**
     * Constructor.
     *
     * @param {string} message
     */
    __construct(message) {
        /**
         * @type {string}
         *
         * @private
         */
        this._message = message;
    }

    /**
     * @returns {string}
     */
    get message() {
        return this._message;
    }
}
