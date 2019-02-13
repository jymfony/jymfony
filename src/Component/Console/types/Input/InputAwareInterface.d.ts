declare namespace Jymfony.Component.Console.Input {
    export class InputAwareInterface implements MixinInterface {
        public static readonly definition: Newable<InputAwareInterface>;

        /**
         * Sets the Console Input.
         */
        public /* writeonly */ input: InputInterface;
    }
}
