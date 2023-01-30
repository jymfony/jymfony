/**
 * @memberOf Jymfony.Component.Messenger.Handler
 */
export default class Acknowledger {
    /**
     * Constructor.
     *
     * @param {string} handlerClass
     * @param {null | function(Error|null, *): Promise<void>} [ack = null]
     */
    __construct(handlerClass, ack = null) {
        /**
         * @type {string}
         *
         * @private
         */
        this._handlerClass = handlerClass;

        /**
         * @type {function((Error|null), *): Promise<void>}
         *
         * @private
         */
        this._ack = ack || (() => {});

        /**
         * @type {Error | null}
         *
         * @private
         */
        this._error = null;

        /**
         * @type {*}
         *
         * @private
         */
        this._result = null;
    }

    /**
     * @param {*} [result = null]
     *
     * @returns {Promise<void>}
     */
    ack(result = null) {
        return this._doAck(null, result);
    }

    nack(error) {
        return this._doAck(error);
    }

    get error() {
        return this._error;
    }

    get result() {
        return this._result;
    }

    get isAcknowledged() {
        return null === this._ack;
    }

    /**
     * @param {Error | null} [e = null]
     * @param {*} [result = null]
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _doAck(e = null, result = null) {
        const ack = this._ack;
        if (!ack ) {
            throw new LogicException(__jymfony.sprintf('The acknowledger cannot be called twice by the "%s" batch handler.', this._handlerClass));
        }

        this._ack = null;
        this._error = e;
        this._result = result;
        await ack(e, result);
    }
}
