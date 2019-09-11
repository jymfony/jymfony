/**
 * @memberOf Jymfony.Component.Console.Input
 *
 * @interface
 */
class InputAwareInterface {
    /**
     * Sets the Console Input.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     */
    set input(input) { }
}

export default getInterface(InputAwareInterface);
