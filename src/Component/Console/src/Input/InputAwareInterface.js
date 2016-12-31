/**
 * @memberOf Jymfony.Console.Input
 * @type InputAwareInterface
 *
 * @interface
 */
class InputAwareInterface {
    /**
     * Sets the Console Input.
     *
     * @param {Jymfony.Console.Input.InputInterface} input
     */
    set input(input) { }
}

module.exports = getInterface(InputAwareInterface);
