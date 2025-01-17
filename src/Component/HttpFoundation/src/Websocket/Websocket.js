const Frame = Jymfony.Component.HttpFoundation.Websocket.Frame;
const Message = Jymfony.Component.HttpFoundation.Websocket.Message;
const WebsocketResponse = Jymfony.Component.HttpFoundation.Websocket.WebsocketResponse;

/**
 * Base class for websocket handlers.
 *
 * @memberOf Jymfony.Component.HttpFoundation.Websocket
 */
export default class Websocket {
    __construct() {
        /**
         * The websocket response (used to send data).
         *
         * @type {Jymfony.Component.HttpFoundation.Websocket.WebsocketResponse}
         */
        this._response = undefined;
    }

    /**
     * The current websocket response.
     *
     * @param {Jymfony.Component.HttpFoundation.Websocket.WebsocketResponse} response
     */
    set response(response) {
        this._response = response;
    }

    /**
     * Sends a message through the websocket.
     *
     * @param {Jymfony.Component.HttpFoundation.Websocket.Message} message
     *
     * @returns {Promise<void>}
     */
    send(message) {
        const frame = new Frame();
        frame.opcode = Message.TYPE_TEXT === message.type ? 0x1 : 0x2;
        frame.fin = true;
        frame.buffer = message.asBuffer();

        return this._response._sendFrame(frame);
    }

    /**
     * Closes the websocket.
     *
     * @param {int} [reason = WebsocketResponse.CLOSE_NORMAL]
     *
     * @returns {Promise<void>}
     */
    close(reason = WebsocketResponse.CLOSE_NORMAL) {
        return this._response.closeConnection(reason);
    }

    /**
     * Handles websocket message.
     *
     * @param {Jymfony.Component.HttpFoundation.Websocket.Message} message
     *
     * @returns {Promise<void>}
     */
    async onMessage(message) { } // eslint-disable-line no-unused-vars

    /**
     * Handles websocket message.
     *
     * @returns {Promise<void>}
     */
    async onClose() { }
}
