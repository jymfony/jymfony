const Descriptor = Jymfony.Component.Console.Descriptor.Descriptor;
const ApplicationDescription = Jymfony.Component.Console.Descriptor.ApplicationDescription;

/**
 * @memberOf Jymfony.Component.Console.Descriptor
 */
class JsonDescriptor extends Descriptor {
    /**
     * @inheritdoc
     */
    describeInputArgument(argument, options = {}) {
        this._writeData(this._getInputArgumentData(argument), options);
    }

    /**
     * @inheritdoc
     */
    describeInputOption(option, options = {}) {
        this._writeData(this._getInputOptionData(option), options);
    }

    /**
     * @inheritdoc
     */
    describeInputDefinition(definition, options = {}) {
        this._writeData(this._getInputDefinitionData(definition), options);
    }

    /**
     * @inheritdoc
     */
    describeCommand(command, options = {}) {
        this._writeData(this._getCommandData(command), options);
    }

    /**
     * @inheritdoc
     */
    describeApplication(application, options = {}) {
        const describedNamespace = options.namespace;
        const description = new ApplicationDescription(application, describedNamespace);
        const commands = [];

        for (const command of Object.values(description.commands)) {
            commands.push(this._getCommandData(command));
        }

        const data = describedNamespace
            ? { commands: commands, namespace: describedNamespace }
            : { commands: commands, namespaces: description.namespaces };

        this._writeData(data, options);
    }

    /**
     * Writes data as json.
     *
     * @param {Object} data
     */
    _writeData(data/* , options */) {
        this._write(JSON.stringify(data));
    }

    /**
     * @param {Jymfony.Component.Console.Input.InputArgument} argument
     *
     * @returns {Object}
     */
    _getInputArgumentData(argument) {
        return {
            name: argument.getName(),
            is_required: argument.isRequired(),
            is_array: argument.isArray(),
            description: argument.getDescription().replace(/\s*[\r\n]\s*/g, ' '),
            'default': argument.getDefault(),
        };
    }

    /**
     * @param {Jymfony.Component.Console.Input.InputOption} option
     *
     * @returns {Object}
     */
    _getInputOptionData(option) {
        return {
            name: '--' + option.getName(),
            shortcut: option.getShortcut() ? '-' + option.getShortcut().replace(/|/, '|-') : '',
            accept_value: option.acceptValue(),
            is_value_required: option.isValueRequired(),
            is_multiple: option.isArray(),
            description: option.getDescription().replace(/\s*[\r\n]\s*/g, ' '),
            'default': option.getDefault(),
        };
    }

    /**
     * @param {Jymfony.Component.Console.Input.InputDefinition} definition
     *
     * @returns {Object}
     */
    _getInputDefinitionData(definition) {
        const inputArguments = {};
        for (const argument of definition.getArguments()) {
            inputArguments[argument.getName()] = this._getInputArgumentData(argument);
        }

        const inputOptions = {};
        for (const option of definition.getOptions()) {
            inputOptions[option.getName()] = this._getInputOptionData(option);
        }

        return { arguments: inputArguments, options: inputOptions };
    }

    /**
     * @param {Jymfony.Component.Console.Command.Command} command
     *
     * @returns {Object}
     */
    _getCommandData(command) {
        command.getSynopsis();
        command.mergeApplicationDefinition(false);

        return {
            name: command.name,
            usage: [ command.getSynopsis(), ...command.usages, ...command.aliases ],
            description: command.description,
            help: command.processedHelp,
            definition: this._getInputDefinitionData(command.nativeDefinition),
        };
    }
}

module.exports = JsonDescriptor;
