const Helper = Jymfony.Component.Console.Helper.Helper;
const InputAwareInterface = Jymfony.Component.Console.Input.InputAwareInterface;

class InputAwareHelper extends mix(Helper, InputAwareInterface) {
    set input(input) {
        /**
         * @type {Jymfony.Component.Console.Input.InputInterface}
         * @protected
         */
        this._input = input;
    }
}

module.exports = InputAwareHelper;
