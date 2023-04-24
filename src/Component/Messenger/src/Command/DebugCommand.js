const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const Command = Jymfony.Component.Console.Command.Command;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;

/**
 * A console command to debug Messenger information.
 *
 * @memberOf Jymfony.Component.Messenger.Command
 */
export default
@AsCommand({ name: 'debug:messenger', description: 'List messages you can dispatch using the message buses' })
class DebugCommand extends Command {
    /**
     * Constructor.
     *
     * @param {Object.<string, Object.<string, Object.<string, string>>>} mapping
     */
    __construct(mapping) {
        /**
         * @type {Object<string, Object<string, Object<string, string>>>}
         *
         * @private
         */
        this._mapping = mapping;

        super.__construct();
    }

    /**
     * @inheritDoc
     */
    configure() {
        this.addArgument('bus', InputArgument.OPTIONAL, __jymfony.sprintf('The bus id (one of "%s")', Object.keys(this._mapping).join('", "')));

        this.help = `
The <info>%command.name%</info> command displays all messages that can be
dispatched using the message buses:

  <info>%command.full_name%</info>

Or for a specific bus only:

  <info>%command.full_name% command_bus</info>

`;
    }

    /**
     * @inheritDoc
     */
    execute(input, output) {
        const io = new JymfonyStyle(input, output);
        io.title('Messenger');

        let mapping = this._mapping;
        const bus = input.getArgument('bus');
        if (bus) {
            if (undefined === mapping[bus]) {
                throw new RuntimeException(__jymfony.sprintf('Bus "%s" does not exist. Known buses are "%s".', bus, Object.keys(this._mapping).join('", "')));
            }

            mapping = { [bus]: mapping[bus] };
        }

        for (const [ bus, handlersByMessage ] of __jymfony.getEntries(mapping)) {
            io.section(bus);

            const tableRows = [];
            for (const [ message, handlers ] of __jymfony.getEntries(handlersByMessage)) {
                const description = __self.getClassDescription(message);
                if (description) {
                    tableRows.push([ __jymfony.sprintf('<comment>%s</>', description) ]);
                }

                tableRows.push([ __jymfony.sprintf('<fg=cyan>%s</fg=cyan>', message) ]);
                for (const handler of handlers) {
                    tableRows.push([
                        __jymfony.sprintf('    handled by <info>%s</>', handler[0]) + this._formatConditions(handler[1]),
                    ]);

                    const handlerDescription = __self.getClassDescription(handler[0]);
                    if (handlerDescription) {
                        tableRows.push([ __jymfony.sprintf('               <comment>%s</>', handlerDescription) ]);
                    }
                }

                tableRows.push([ '' ]);
            }

            if (0 < tableRows.length) {
                io.text('The following messages can be dispatched:');
                io.newLine();
                io.table([], tableRows);
            } else {
                io.warning(__jymfony.sprintf('No handled message found in bus "%s".', bus));
            }
        }

        return 0;
    }

    _formatConditions(options) {
        if (0 === Object.keys(options).length) {
            return '';
        }

        const optionsMapping = [];
        for (const [ key, value ] of __jymfony.getEntries(options)) {
            optionsMapping.push(key + '=' + value);
        }

        return ' (when ' + optionsMapping.join(', ') + ')';
    }

    static getClassDescription(klass) {
        try {
            const r = new ReflectionClass(klass);
            const { docblock } = r;

            if (docblock) {
                const docComment = docblock
                    .substring(3, docblock.length - 2)
                    .split(/\n\s*\*\s*[\n@]/)[0]
                    .replace(/\s*\n\s*\*\s*/g, ' ');

                return __jymfony.trim(docComment);
            }
        } catch (e) {
        }

        return '';
    }

    complete(input, suggestions) {
        if (input.mustSuggestArgumentValuesFor('bus')) {
            suggestions.suggestValues(Object.keys(this._mapping));
        }
    }
}
