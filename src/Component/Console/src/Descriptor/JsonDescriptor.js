const Descriptor = Jymfony.Component.Console.Descriptor.Descriptor;
const ApplicationDescription = Jymfony.Component.Console.Descriptor.ApplicationDescription;

module.exports = class JsonDescriptor extends Descriptor {
    /**
     * @inheritDoc
     */
    describeInputArgument(argument, options = {}) {
        this._writeData(this._getInputArgumentData(argument), options);
    }

    /**
     * @inheritDoc
     */
    describeInputOption(option, options = {}) {
        this._writeData(this._getInputOptionData(option), options);
    }

    /**
     * @inheritDoc
     */
    describeInputDefinition(definition, options = {}) {
        this._writeData(this._getInputDefinitionData(definition), options);
    }

    /**
     * @inheritDoc
     */
    describeCommand(command, options = {}) {
        this._writeData(this._getCommandData(command), options);
    }

    /**
     * @inheritDoc
     */
    describeApplication(application, options = {}) {
        let describedNamespace = options.namespace;
        let description = new ApplicationDescription(application, describedNamespace);
        let commands = [];

        for (let command of Object.values(description.commands)) {
            commands.push(this._getCommandData(command));
        }

        let data = describedNamespace
            ? { commands: commands, namespace: describedNamespace }
            : { commands: commands, namespaces: description.namespaces };

        this._writeData(data, options);
    }

    /**
     * Writes data as json.
     *
     * @param {Object} data
     * @param {Object} options
     *
     * @returns {string}
     */
    _writeData(data, options) {
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
     * @returns Object
     */
    _getInputDefinitionData(definition) {
        let inputArguments = {};
        for (let argument of definition.getArguments()) {
            inputArguments[argument.getName()] = this._getInputArgumentData(argument);
        }

        let inputOptions = {};
        for (let option of definition.getOptions()) {
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
};
