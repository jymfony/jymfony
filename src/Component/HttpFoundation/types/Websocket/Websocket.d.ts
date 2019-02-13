declare namespace Jymfony.Component.HttpFoundation.Websocket {
    /**
     * Base class for websocket handlers.
     */
    export class Websocket {
        /**
         * The websocket response (used to send data).
         */
        private _response: WebsocketResponse;

        __construct(): void;
        constructor();

        /**
         * The current websocket response.
         */
        public /* writeonly */ response: WebsocketResponse;

        /**
         * Sends a message through the websocket.
         */
        send(message: Message): Promise<void>;

        /**
         * Closes the websocket.
         */
        close(reason?: number): Promise<void>;

        /**
         * Handles websocket message.
         */
        onMessage(message: Message): Promise<void>;

        /**
         * Handles websocket message.
         */
        onClose(): Promise<void>;
    }
}
