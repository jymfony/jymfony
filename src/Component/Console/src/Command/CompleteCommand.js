import { EOL, tmpdir } from 'os';
import { appendFileSync } from 'fs';
import { basename } from 'path';

const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const Command = Jymfony.Component.Console.Command.Command;
const CommandNotFoundException = Jymfony.Component.Console.Exception.CommandNotFoundException;
const CompletionInput = Jymfony.Component.Console.Completion.CompletionInput;
const CompletionSuggestions = Jymfony.Component.Console.Completion.CompletionSuggestions;
const DateTime = Jymfony.Component.DateTime.DateTime;
const ExceptionInterface = Jymfony.Component.Console.Exception.ExceptionInterface;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const LazyCommand = Jymfony.Component.Console.Command.LazyCommand;

/**
 * Responsible for providing the values to the shell completion.
 *
 * @memberOf Jymfony.Component.Console.Command
 * @final
 */
export default
@AsCommand({ name: '|_complete', description: 'Internal command to provide shell completion suggestions' })
class CompleteCommand extends Command {
    /**
     * @param {Object.<string, string>} completionOutputs A list of additional completion outputs, with shell name as key and FQCN as value
     */
    __construct(completionOutputs = {}) {
        /**
         * Must be set before the parent constructor, as the property value is used in configure()
         *
         * @type {Object.<string, string>}
         *
         * @private
         */
        this._completionOutputs = Object.assign({}, { bash: 'Jymfony.Component.Console.Completion.Output.BashCompletionOutput' }, completionOutputs);

        /**
         * @type {boolean}
         *
         * @private
         */
        this._isDebug = false;

        super.__construct();
    }

    configure() {
        this
            .addOption('shell', 's', InputOption.VALUE_REQUIRED, 'The shell type ("' + Object.keys(this._completionOutputs).join('", "') + '")')
            .addOption('input', 'i', InputOption.VALUE_REQUIRED | InputOption.VALUE_IS_ARRAY, 'An array of input tokens (e.g. COMP_WORDS or argv)')
            .addOption('current', 'c', InputOption.VALUE_REQUIRED, 'The index of the "input" array that the cursor is in (e.g. COMP_CWORD)')
            .addOption('jymfony', 'j', InputOption.VALUE_REQUIRED, 'The version of the completion script')
        ;
    }

    initialize() {
        this._isDebug = !! process.env.JYMFONY_COMPLETION_DEBUG;
    }

    async execute(input, output) {
        try {
            // Uncomment when a bugfix or BC break has been introduced in the shell completion scripts
            // Version = input.getOption('jymfony');
            // If (version && __jymfony.version_compare(version, 'x.y', '>=')) {
            //    Const message = __jymfony.sprintf('Completion script version is not supported ("%s" given, ">=x.y" required).', version);
            //    This._log(message);
            //    Output.writeln(message + ' Install the Jymfony completion script again by using the "completion" command.');
            //
            //    Return 126;
            // }

            const shell = input.getOption('shell');
            if (!shell) {
                throw new RuntimeException('The "--shell" option must be set.');
            }

            const completionOutputClass = this._completionOutputs[shell] || false;
            if (!completionOutputClass) {
                throw new RuntimeException(__jymfony.sprintf('Shell completion is not supported for your shell: "%s" (supported: "%s").', shell, Object.keys(this._completionOutputs).join('", "')));
            }

            const completionInput = this._createCompletionInput(input);
            const suggestions = new CompletionSuggestions();

            this._log([
                '',
                '<comment>' + new DateTime().format('Y-m-d H:i:s') + '</>',
                '<info>Input:</> <comment>("|" indicates the cursor position)</>',
                '  ' + completionInput.toString(),
                '<info>Command:</>',
                '  ' + process.argv.join(' '),
                '<info>Messages:</>',
            ]);

            const command = this._findCommand(completionInput);
            if (null === command) {
                this._log('  No command found, completing using the Application class.');
                await this.application.complete(completionInput, suggestions);
            } else if (
                completionInput.mustSuggestArgumentValuesFor('command')
                && command.name !== completionInput.completionValue
                && !command.aliases.includes(completionInput.completionValue)
            ) {
                this._log('  No command found, completing using the Application class.');

                // Expand shortcut names ("cache:cl<TAB>") into their full name ("cache:clear")
                suggestions.suggestValues([ command.name, ...command.aliases ].filter(v => !!v));
            } else {
                command.mergeApplicationDefinition();
                completionInput.bind(command.definition);

                if (CompletionInput.TYPE_OPTION_NAME === completionInput.completionType) {
                    this._log('  Completing option names for the <comment>' + ReflectionClass.getClassName(command instanceof LazyCommand ? command.command : command) + '</> command.');
                    suggestions.suggestOptions(command.definition.getOptions());
                } else {
                    this._log([
                        '  Completing using the <comment>'+ ReflectionClass.getClassName(command instanceof LazyCommand ? command.command : command) + '</> class.',
                        '  Completing <comment>' + completionInput.completionType + '</> for <comment>' + completionInput.completionName + '</>',
                    ]);

                    const compval = completionInput.completionValue;
                    if (null !== compval) {
                        this._log('  Current value: <comment>' + compval + '</>');
                    }

                    await command.complete(completionInput, suggestions);
                }
            }

            /** @type {Jymfony.Component.Console.Completion.Output.CompletionOutputInterface} completionOutput */
            const completionOutput = new (ReflectionClass.getClass(completionOutputClass))();

            this._log('<info>Suggestions:</>');
            const options = suggestions.optionSuggestions;
            const values = suggestions.valueSuggestions;
            if (0 < options.length) {
                this._log('  --' + options.map(o => o.getName()).join(' --'));
            } else if (0 < values.length) {
                this._log('  ' + values.join(' '));
            } else {
                this._log('  <comment>No suggestions were provided</>');
            }

            completionOutput.write(suggestions, output);
        } catch (e) {
            this._log([
                '<error>Error!</error>',
                e.toString(),
            ]);

            if (output.isDebug()) {
                throw e;
            }

            return __self.FAILURE;
        }

        return __self.SUCCESS;
    }

    /**
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @returns {Jymfony.Component.Console.Completion.CompletionInput}
     *
     * @private
     */
    _createCompletionInput(input) {
        const currentIndex = input.getOption('current');
        if (!currentIndex || !isNumeric(currentIndex)) {
            throw new RuntimeException('The "--current" option must be set and it must be an integer.');
        }

        const completionInput = CompletionInput.fromTokens(input.getOption('input'), ~~currentIndex);

        try {
            completionInput.bind(this.application.definition);
        } catch (e) {
            if (! (e instanceof ExceptionInterface)) {
                throw e;
            }
        }

        return completionInput;
    }

    /**
     * @param {Jymfony.Component.Console.Completion.CompletionInput} completionInput
     *
     * @returns {Jymfony.Component.Console.Command.Command | null}
     */
    _findCommand(completionInput) {
        try {
            const inputName = completionInput.arguments.command;
            if (undefined === inputName) {
                return null;
            }

            return this.application.find(inputName);
        } catch (e) {
            if (! (e instanceof CommandNotFoundException)) {
                throw e;
            }
        }

        return null;
    }

    _log(messages) {
        if (! this._isDebug) {
            return;
        }

        messages = isArray(messages) ? messages : [ messages ];

        const commandName = basename(process.argv[1]);
        appendFileSync(tmpdir() + '/jf_' + commandName + '.log', messages.join(EOL) + EOL);
    }
}
