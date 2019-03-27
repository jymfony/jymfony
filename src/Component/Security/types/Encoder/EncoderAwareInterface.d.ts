declare namespace Jymfony.Component.Security.Encoder {
    export class EncoderAwareInterface implements MixinInterface {
        /**
         * Gets the name of the encoder used to encode the password.
         *
         * If the method returns null, the standard way to retrieve the encoder
         * will be used instead.
         */
        public readonly encoderName: string;
    }
}
