declare namespace Jymfony.Component.Console.Input {
    export class StreamableInputInterface extends InputInterface implements MixinInterface {
        public static readonly definition: Newable<StreamableInputInterface>;

        /**
         * Sets/gets the input stream to read from when interacting with the user.
         * This is mainly useful for testing purpose.
         */
        public stream: NodeJS.ReadableStream|undefined;
    }
}
