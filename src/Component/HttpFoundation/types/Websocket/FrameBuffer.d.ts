declare namespace Jymfony.Component.HttpFoundation.Websocket {
    /**
     * Utility class to decode a websocket frame.
     *
     * @internal
     */
    export class FrameBuffer {
        /**
         * Temporary buffer.
         */
        private _buffer: Buffer;

        /**
         * Incomplete frames buffer.
         */
        private _frames: Frame[];

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Adds data, generates decoded messages.
         */
        concat(data: Buffer): IterableIterator<Message>;

        /**
         * Adds a frame to the buffer.
         */
        private _addFrame(frame: Frame): void;

        /**
         * Builds a message from the buffered frames.
         */
        private _buildMessage(): Message;
    }
}
