const ApplicationDescription = Jymfony.Component.Console.Descriptor.ApplicationDescription;
const Descriptor = Jymfony.Component.Console.Descriptor.Descriptor;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const util = require('util');

/**
 * @memberOf Jymfony.Component.Console.Descriptor
 * @type TextDescriptor
 *
 * @internal
 */
module.exports = class TextDescriptor extends Descriptor {
    /**
     * @inheritDoc
     */
    describeInputArgument(argument, options = {}) {
        let defaultValue;
        if (argument.getDefault() && (! isArray(argument.getDefault()) || argument.getDefault().length)) {
            defaultValue = util.format('<comment> [default: %s]</comment>', this._formatDefaultValue(argument.getDefault()));
        } else {
            defaultValue = '';
        }

        let totalWidth = options['total_width'] || argument.getName().length;
        let spacingWidth = totalWidth - argument.getName().length;

        this._writeText(util.format('  <info>%s</info>  %s%s%s',
            argument.getName(),
            ' '.repeat(spacingWidth),
            // + 4 = 2 spaces before <info>, 2 spaces after </info>
            argument.getDescription().replace(/\s*[\r\n]\s*/g, "\n" + ' '.repeat(totalWidth + 4)),
            defaultValue
        ), options);
    }

    /**
     * @inheritDoc
     */
    describeInputOption(option, options = {}) {
        let defaultValue;
        if (option.acceptValue() && option.getDefault() && (! isArray(option.getDefault()) || option.getDefault().length)) {
            defaultValue = util.format('<comment> [default: %s]</comment>', this._formatDefaultValue(option.getDefault()));
        } else {
            defaultValue = '';
        }

        let value = '';
        if (option.acceptValue()) {
            value = '=' + option.getName().toUpperCase();

            if (option.isValueOptional()) {
                value = '[' + value + ']';
            }
        }

        let totalWidth = options.total_width || this._calculateTotalWidthForOptions([ option ]);
        let synopsis = util.format('%s%s',
            option.getShortcut() ? util.format('-%s, ', option.getShortcut()) : '    ',
            util.format('--%s%s', option.getName(), value)
        );

        let spacingWidth = totalWidth - synopsis.length;

        this._writeText(util.format('  <info>%s</info>  %s%s%s%s',
            synopsis,
            ' '.repeat(spacingWidth),
            // + 4 = 2 spaces before <info>, 2 spaces after </info>
            option.getDescription().replace(/\s*[\r\n]\s*/g, "\n" + ' '.repeat(totalWidth + 4)),
            defaultValue,
            option.isArray() ? '<comment> (multiple values allowed)</comment>' : ''
        ), options);
    }

    /**
     * @inheritDoc
     */
    describeInputDefinition(definition, options = {}) {
        let totalWidth = this._calculateTotalWidthForOptions(definition.getOptions());
        for (let argument of definition.getArguments()) {
            totalWidth = Math.max(totalWidth, argument.getName().length);
        }

        if (definition.getArguments().length) {
            this._writeText('<comment>Arguments:</comment>', options);
            this._writeText("\n");
            for (let argument of definition.getArguments()) {
                this.describeInputArgument(argument, Object.assign({}, options, { total_width: totalWidth }));
                this._writeText("\n");
            }
        }

        if (definition.getArguments().length && definition.getOptions().length) {
            this._writeText("\n");
        }

        if (definition.getOptions().length) {
            let laterOptions = [];

            this._writeText('<comment>Options:</comment>', options);
            for (let option of definition.getOptions()) {
                if (1 < option.getShortcut().length) {
                    laterOptions.push(option);
                    continue;
                }

                this._writeText("\n");
                this.describeInputOption(option, Object.assign({}, options, { total_width: totalWidth }));
            }

            for (let option of laterOptions) {
                this._writeText("\n");
                this.describeInputOption(option, Object.assign({}, options, { total_width: totalWidth }));
            }
        }
    }

    /**
     * @inheritDoc
     */
    describeCommand(command, options = {}) {
        command.getSynopsis(true);
        command.getSynopsis(false);
        command.mergeApplicationDefinition(false);

        this._writeText('<comment>Usage:</comment>', options);

        for (let usage of [ command.getSynopsis(true), ...command.aliases, command.usages ]) {
            this._writeText("\n");
            this._writeText('  ' + usage, options);
        }
        this._writeText("\n");

        let definition = command.nativeDefinition;
        if (definition.getOptions().length || definition.getArguments().length) {
            this.describeInputDefinition(definition, options);
            this._writeText("\n");
        }

        let help;
        if (help = command.processedHelp) {
            this._writeText("\n");
            this._writeText('<comment>Help:</comment>', options);
            this._writeText("\n");
            this._writeText('  ' + help.replace(/\n/g, "\n  "), options);
            this._writeText("\n");
        }
    }

    /**
     * @inheritDoc
     */
    describeApplication(application, options = {}) {
        let describedNamespace = options.namespace;
        let description = new ApplicationDescription(application, describedNamespace);

        if (options.raw_text) {
            let width = this._getColumnWidth(Object.values(description.commands));

            for (let command of Object.values(description.commands)) {
                this._writeText(util.format("%s %s", (' '.repeat(width) + command.name).slice(-width), command.description), options);
                this._writeText("\n");
            }
        } else {
            let help = application.help;
            if (help) {
                this._writeText(help + "\n\n", options);
            }

            this._writeText("<comment>Usage:</comment>\n", options);
            this._writeText("  command [options] [arguments]\n\n", options);

            this.describeInputDefinition(new InputDefinition(application.definition.getOptions()), options);

            this._writeText("\n");
            this._writeText("\n");

            let width = this._getColumnWidth(Object.values(description.commands));

            if (describedNamespace) {
                this._writeText(util.format('<comment>Available commands for the "%s" namespace:</comment>', describedNamespace), options);
            } else {
                this._writeText('<comment>Available commands:</comment>', options);
            }

            // Add commands by namespace
            let commands = description.commands;

            for (let namespace of description.namespaces) {
                if (! describedNamespace && ApplicationDescription.GLOBAL_NAMESPACE !== namespace.id) {
                    this._writeText("\n");
                    this._writeText(' <comment>' + namespace.id + '</comment>', options);
                }

                for (let name of namespace.commands) {
                    if (commands[name]) {
                        this._writeText("\n");
                        let spacingWidth = width - name.length;
                        let command = commands[name];
                        let commandAliases = this._getCommandAliasesText(command);
                        this._writeText(util.format('  <info>%s</info>%s%s', name, ' '.repeat(spacingWidth), commandAliases + command.description), options);
                    }
                }
            }

            this._writeText("\n");
        }
    }

    /**
     * @private
     */
    _writeText(content, options = {}) {
        this._write(
            options.raw_text ? __jymfony.strip_tags(content) : content,
            ! options.raw_output
        );
    }

    /**
     * Formats command aliases to show them in the command description.
     *
     * @param {Jymfony.Component.Console.Command.Command} command
     *
     * @returns {string}
     *
     * @private
     */
    _getCommandAliasesText(command) {
        let text = '';
        let aliases = command.aliases;

        if (aliases.length) {
            text = '[' + aliases.join('|') + '] ';
        }

        return text;
    }

    /**
     * Formats input option/argument default value.
     *
     * @param {*} defaultValue
     *
     * @returns {string}
     *
     * @private
     */
    _formatDefaultValue(defaultValue) {
        JSON.stringify(defaultValue).replace(/\\\\/g, '\\');
    }

    /**
     * @param {Jymfony.Component.Console.Command.Command[]} commands
     *
     * @returns {int}
     *
     * @private
     */
    _getColumnWidth(commands) {
        let widths = [];

        for (let command of commands) {
            widths.push(command.name.length);
            for (let alias of command.aliases) {
                widths.push(alias.length);
            }
        }

        return Math.max(...widths) + 2;
    }

    /**
     * @param {Jymfony.Component.Console.Input.InputOption[]} options
     *
     * @returns {int}
     *
     * @private
     */
    _calculateTotalWidthForOptions(options) {
        let totalWidth = 0;
        for (let option of options) {
            // "-" + shortcut + ", --" + name
            let nameLength = 1 + Math.max(option.getShortcut().length, 1) + 4 + option.getName().length;

            if (option.acceptValue()) {
                let valueLength = 1 + option.getName().length; // = + value
                valueLength += option.isValueOptional() ? 2 : 0; // [ + ]

                nameLength += valueLength;
            }

            totalWidth = Math.max(totalWidth, nameLength);
        }

        return totalWidth;
    }
};
