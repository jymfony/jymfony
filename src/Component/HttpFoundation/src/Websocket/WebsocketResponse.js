import { createHash } from 'crypto';
const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const Response = Jymfony.Component.HttpFoundation.Response;
const CloseFrameException = Jymfony.Component.HttpFoundation.Websocket.Exception.CloseFrameException;
const Frame = Jymfony.Component.HttpFoundation.Websocket.Frame;
const FrameBuffer = Jymfony.Component.HttpFoundation.Websocket.FrameBuffer;
const Message = Jymfony.Component.HttpFoundation.Websocket.Message;
const HttpServerEvents = Jymfony.Component.HttpServer.Event.HttpServerEvents;

/**
 * @memberOf Jymfony.Component.HttpFoundation.Websocket
 */
export default class WebsocketResponse extends mix(Response, EventSubscriberInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpFoundation.Websocket.Websocket} websocket
     * @param {Object.<string, string|string[]>} headers
     */
    __construct(websocket, headers = {}) {
        super.__construct(undefined, Response.HTTP_SWITCHING_PROTOCOLS, headers);

        /**
         * @type {net.Socket}
         *
         * @private
         */
        this._socket = undefined;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._connected = false;

        /**
         * @type {Jymfony.Component.HttpFoundation.Websocket.FrameBuffer}
         *
         * @private
         */
        this._frameBuffer = new FrameBuffer();

        /**
         * @type {Jymfony.Component.HttpFoundation.Websocket.Websocket}
         *
         * @private
         */
        this._websocket = websocket;

        /**
         * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
         *
         * @private
         */
        this._eventDispatcher = undefined;
    }

    /**
     * Subscribe to the given event dispatcher.
     *
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} dispatcher
     */
    set eventDispatcher(dispatcher) {
        this._eventDispatcher = dispatcher;
        dispatcher.addSubscriber(this);
    }

    /**
     * @inheritdoc
     */
    async prepare(request) {
        await super.prepare(request);

        this.headers.set('Upgrade', 'websocket');
        this.headers.set('Connection', 'upgrade');

        const sha1 = createHash('sha1');
        sha1.update(request.headers.get('Sec-WebSocket-Key') + __self.RFC6455_GUID);
        this.headers.set('Sec-WebSocket-Accept', sha1.digest('base64'));

        return this;
    }

    /**
     * @inheritdoc
     */
    async sendResponse(req, res) {
        this._socket = req.socket;
        if (res.respond) {
            res.respond(Object.assign({ ':status': this.statusCode }, this.headers.all));
        } else {
            res.writeHead(this.statusCode, this.statusText, this.headers.all);
        }

        this._websocket.response = this;

        const pingTimer = setInterval(this._sendPing.bind(this), 60000);
        this._connected = true;

        this._socket.on('data', this._handleWebSocketData.bind(this));
        this._socket.on('close', () => {
            this._connected = false;
            this._eventDispatcher.removeSubscriber(this);
            clearInterval(pingTimer);
        });
    }

    /**
     * Closes the websocket connection.
     *
     * @param {int|string} reason
     *
     * @returns {Promise<void>}
     */
    async closeConnection(reason = __self.CLOSE_NORMAL) {
        if (! this._connected) {
            return;
        }

        await this._websocket.onClose();

        const frame = new Frame();
        frame.opcode = 0x8;
        frame.fin = true;

        if (isString(reason)) {
            frame.buffer = Buffer.allocUnsafe(2 + reason.length);
            frame.buffer.writeUInt16BE(__self.CLOSE_NORMAL, 0);
            frame.buffer.write(reason, 2);
        } else {
            frame.buffer = Buffer.allocUnsafe(2);
            frame.buffer.writeUInt16BE(reason, 0);
        }

        this._connected = false;
        await this._sendFrame(frame);
        this._socket.end();
    }

    /**
     * Called upon http server termination.
     *
     * @return {Promise<void>}
     */
    onTerminate() {
        return this.closeConnection(__self.CLOSE_SHUTDOWN);
    }

    /**
     * @inheritdoc
     */
    static getSubscribedEvents() {
        return {
            [HttpServerEvents.SERVER_TERMINATE]: 'onTerminate',
        };
    }

    /**
     * Handles incoming data from websocket.
     *
     * @param {Buffer} data
     *
     * @private
     */
    async _handleWebSocketData(data) {
        try {
            for (const message of this._frameBuffer.concat(data)) {
                if (message.type === Message.TYPE_PING) {
                    await this._sendPong(message);
                    continue;
                }

                await this._websocket.onMessage(message);
            }
        } catch (e) {
            if (e instanceof CloseFrameException) {
                await this.closeConnection();
                return;
            }

            await this.closeConnection(__self.CLOSE_ERROR);
        }
    }

    /**
     * Sends a ping request.
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    _sendPing() {
        const frame = new Frame();
        frame.opcode = 0x9;
        frame.fin = true;

        return this._sendFrame(frame);
    }

    /**
     * Sends a pong in response to a ping request.
     *
     * @param {Jymfony.Component.HttpFoundation.Websocket.Message} message
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    _sendPong(message) {
        const frame = new Frame();
        frame.opcode = 0xA;
        frame.fin = true;
        frame.buffer = message.asBuffer();

        return this._sendFrame(frame);
    }

    /**
     * Sends a frame.
     *
     * @param {Jymfony.Component.HttpFoundation.Websocket.Frame} frame
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    _sendFrame(frame) {
        if (! this._connected) {
            return Promise.resolve();
        }

        return new Promise(((resolve, reject) => {
            this._socket.write(frame.toBuffer(), (err) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        }));
    }
}

WebsocketResponse.CLOSE_NORMAL = 1000;
WebsocketResponse.CLOSE_SHUTDOWN = 1001;
WebsocketResponse.CLOSE_ERROR = 1002;

WebsocketResponse.RFC6455_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
