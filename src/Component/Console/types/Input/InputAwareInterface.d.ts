declare namespace Jymfony.Component.Console.Input {
    export class InputAwareInterface {
        public static readonly definition: Newable<InputAwareInterface>;

        /**
         * Sets the Console Input.
         */
        public /* writeonly */ input: InputInterface;
    }
}
