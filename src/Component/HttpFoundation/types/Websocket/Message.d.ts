declare namespace Jymfony.Component.HttpFoundation.Websocket {
    export class Message {
        public static readonly TYPE_TEXT = 'text';
        public static readonly TYPE_BINARY = 'binary';
        public static readonly TYPE_PING = 'ping';

        private _buffer: Buffer;

        private _type: string;

        /**
         * Constructor.
         */
        __construct(data: Buffer | string, type?: string): void;
        constructor(data: Buffer | string, type?: string);

        /**
         * The message type.
         */
        public readonly type: string;

        /**
         * Gets the message data as buffer.
         */
        asBuffer(): Buffer;

        /**
         * Gets the message data as string.
         */
        asString(encoding?: string): string;
    }
}
