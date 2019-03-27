declare namespace Jymfony.Component.HttpFoundation.Websocket.Exception {
    import Message = Jymfony.Component.HttpFoundation.Websocket.Message;

    export class CloseFrameException extends global.Exception {
        private _websocketMessage: Message;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(wsMessage: Message, message?: string, code?: number | null, previous?: Error): void;
        constructor(wsMessage: Message, message?: string, code?: number | null, previous?: Error);

        /**
         * The websocket message that generated the closing request.
         */
        public readonly websocketMessage: Message;
    }
}
