declare namespace Jymfony.Component.HttpFoundation.Websocket {
    export class Frame {
        public fin: boolean;

        public rsv1: boolean;

        public rsv2: boolean;

        public rsv3: boolean;

        public opcode?: number;

        public mask: number[];

        public buffer: Buffer;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Converts this frame to a Buffer.
         */
        toBuffer(): Buffer;

        /**
         * Initializes a frame from Buffer.
         */
        static fromBuffer(buffer: Buffer): [Frame, Buffer] | null;
    }
}
