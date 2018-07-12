const Application = Jymfony.Component.Console.Application;
const Command = Jymfony.Component.Console.Command.Command;
const DescriptorInterface = Jymfony.Component.Console.Descriptor.DescriptorInterface;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

/**
 * @memberOf Jymfony.Component.Console.Descriptor
 */
class Descriptor extends implementationOf(DescriptorInterface) {
    /**
     * @inheritdoc
     */
    describe(output, object, options = {}) {
        this._output = output;

        switch (true) {
            case object instanceof InputArgument:
                this.describeInputArgument(object, options);
                break;

            case object instanceof InputOption:
                this.describeInputOption(object, options);
                break;

            case object instanceof InputDefinition:
                this.describeInputDefinition(object, options);
                break;

            case object instanceof Command:
                this.describeCommand(object, options);
                break;

            case object instanceof Application:
                this.describeApplication(object, options);
                break;

            default:
                throw new InvalidArgumentException(
                    __jymfony.sprintf('Object of type "%s" is not describable.', ReflectionClass.getClassName(object))
                );
        }
    }

    /**
     * Writes content to output.
     *
     * @param {string} content
     * @param {boolean} [decorated = false]
     *
     * @protected
     */
    _write(content, decorated = false) {
        this._output.write(content, false, decorated ? OutputInterface.OUTPUT_NORMAL : OutputInterface.OUTPUT_RAW);
    }

    /**
     * Describes an InputArgument instance.
     *
     * @param {Jymfony.Component.Console.Input.InputArgument} argument
     * @param {*} [options = {}]
     *
     * @returns {string|*}
     *
     * @protected
     * @abstract
     */
    describeInputArgument(argument, options = {}) { // eslint-disable-line no-unused-vars
        throw new Error('describeInputArgument must be overridden');
    }

    /**
     * Describes an InputOption instance.
     *
     * @param {Jymfony.Component.Console.Input.InputOption} option
     * @param {*} [options = {}]
     *
     * @returns {string|*}
     *
     * @protected
     * @abstract
     */
    describeInputOption(option, options = {}) { // eslint-disable-line no-unused-vars
        throw new Error('describeInputOption must be overridden');
    }

    /**
     * Describes an InputDefinition instance.
     *
     * @param {Jymfony.Component.Console.Input.InputDefinition} definition
     * @param {*} [options = {}]
     *
     * @returns {string|*}
     *
     * @protected
     * @abstract
     */
    describeInputDefinition(definition, options = {}) { // eslint-disable-line no-unused-vars
        throw new Error('describeInputOption must be overridden');
    }

    /**
     * Describes a Command instance.
     *
     * @param {Jymfony.Component.Console.Command.Command} command
     * @param {*} [options = {}]
     *
     * @returns {string|*}
     *
     * @protected
     * @abstract
     */
    describeCommand(command, options = {}) { // eslint-disable-line no-unused-vars
        throw new Error('describeInputOption must be overridden');
    }

    /**
     * Describes an Application instance.
     *
     * @param {Jymfony.Component.Console.Application} application
     * @param {*} [options = {}]
     *
     * @returns {string|*}
     *
     * @protected
     * @abstract
     */
    describeApplication(application, options = {}) { // eslint-disable-line no-unused-vars
        throw new Error('describeInputOption must be overridden');
    }
}

module.exports = Descriptor;
