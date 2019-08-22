/**
 * @memberOf Jymfony.Component.HttpFoundation.Websocket.Exception
 */
export default class CloseFrameException extends Exception {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpFoundation.Websocket.Message} wsMessage
     * @param {string} [message = 'Close request']
     * @param {int|null} [code = null]
     * @param {Exception} [previous]
     */
    __construct(wsMessage, message = 'Close request', code = null, previous = undefined) {
        super.__construct(message, code, previous);

        /**
         * @type {Jymfony.Component.HttpFoundation.Websocket.Message}
         *
         * @private
         */
        this._websocketMessage = wsMessage;
    }

    /**
     * The websocket message that generated the closing request.
     *
     * @returns {Jymfony.Component.HttpFoundation.Websocket.Message}
     */
    get websocketMessage() {
        return this._websocketMessage;
    }
}
