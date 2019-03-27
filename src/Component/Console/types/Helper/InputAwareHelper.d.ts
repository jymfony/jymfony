declare namespace Jymfony.Component.Console.Helper {
    import InputAwareInterface = Jymfony.Component.Console.Input.InputAwareInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;

    export class InputAwareHelper extends mix(Helper, InputAwareInterface) {
        protected _input: InputInterface;

        public /* writeonly */ input: InputInterface;
    }
}
