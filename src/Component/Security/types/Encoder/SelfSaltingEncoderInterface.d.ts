declare namespace Jymfony.Component.Security.Encoder {
    /**
     * SelfSaltingEncoderInterface is a marker interface for encoders that do not
     * require a user-generated salt.
     */
    export class SelfSaltingEncoderInterface implements MixinInterface {
        public static readonly definition: Newable<SelfSaltingEncoderInterface>;
    }
}
