const Helper = Jymfony.Component.Console.Helper.Helper;
const InputAwareInterface = Jymfony.Component.Console.Input.InputAwareInterface;

class InputAwareHelper extends mix(Helper, InputAwareInterface) {
    /**
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     */
    set input(input) {
        /**
         * @type {Jymfony.Component.Console.Input.InputInterface}
         *
         * @protected
         */
        this._input = input;
    }
}

module.exports = InputAwareHelper;
