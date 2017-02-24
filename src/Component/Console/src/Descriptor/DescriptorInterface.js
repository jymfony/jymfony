/**
 * @memberOf Jymfony.Component.Console.Descriptor
 * @type DescriptorInterface
 *
 * @interface
 */
class DescriptorInterface {
    /**
     * Describes an InputArgument instance.
     *
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     * @param {Object} object
     * @param {*} options
     */
    describe(output, object, options = {}) { }
}

module.exports = getInterface(DescriptorInterface);
