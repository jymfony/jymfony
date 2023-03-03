import { appendFileSync, existsSync, realpathSync } from 'fs';
import { basename } from 'path';
import { spawn } from 'child_process';
import { tmpdir } from 'os';

const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const Command = Jymfony.Component.Console.Command.Command;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputOption = Jymfony.Component.Console.Input.InputOption;

/**
 * Dumps the completion script for the current shell.
 *
 * @memberOf Jymfony.Component.Console.Command
 * @final
 */
export default
@AsCommand({ name: 'completion', description: 'Dump the shell completion script' })
class DumpCompletionCommand extends Command {
    __construct(name) {
        super.__construct(name);

        /**
         * @type {string[]}
         *
         * @private
         */
        this._supportedShells = null;
    }

    configure() {
        const [ fullCommand, commandName ] = (() => {
            let fullCommand = process.argv[1];
            if (! fullCommand) {
                return [ process.argv[0], process.argv[0] ];
            }

            const commandName = basename(fullCommand);
            fullCommand = (() => {
                try {
                    return realpathSync(fullCommand);
                } catch (_) {
                    return null;
                }
            })() || fullCommand;

            return [ fullCommand, commandName ];
        })();

        this.help = `The <info>%command.name%</> command dumps the shell completion script required
to use shell autocompletion (currently only bash completion is supported).

<comment>Static installation
-------------------</>

Dump the script to a global completion file and restart your shell:

    <info>%command.full_name% bash | sudo tee /etc/bash_completion.d/${commandName}</>

Or dump the script to a local file and source it:

    <info>%command.full_name% bash > completion.sh</>

    <comment># source the file whenever you use the project</>
    <info>source completion.sh</>

    <comment># or add this line at the end of your "~/.bashrc" file:</>
    <info>source /path/to/completion.sh</>

<comment>Dynamic installation
--------------------</>

Add this to the end of your shell configuration file (e.g. <info>"~/.bashrc"</>):

    <info>eval "$(${fullCommand} completion bash)"</>
`;
        this
            .addArgument('shell', InputArgument.OPTIONAL, 'The shell type (e.g. "bash"), the value of the "$SHELL" env var will be used if this is not given', null, this._getSupportedShells.bind(this))
            .addOption('debug', null, InputOption.VALUE_NONE, 'Tail the completion debug log')
        ;
    }

    async execute(input, output) {
        if (!ReflectionClass.exists('Jymfony.Component.Filesystem.File')) {
            throw new RuntimeException('This command needs the filesystem component to be installed. Run npm install @jymfony/filesystem and retry.');
        }

        const File = Jymfony.Component.Filesystem.File;
        const commandName = basename(process.argv[1]);

        if (input.getOption('debug')) {
            await this._tailDebugLog(commandName, output);

            return __self.SUCCESS;
        }

        const shell = input.getArgument('shell') || __self._guessShell();
        const completionFile = __dirname + '/../Resources/completion.' + shell;
        if (!existsSync(completionFile)) {
            const supportedShells = await this._getSupportedShells();

            if (output instanceof ConsoleOutputInterface) {
                output = output.errorOutput;
            }

            if (shell) {
                output.writeln(__jymfony.sprintf('<error>Detected shell "%s", which is not supported by Symfony shell completion (supported shells: "%s").</>', shell, supportedShells.join('", "')));
            } else {
                output.writeln(__jymfony.sprintf('<error>Shell not detected, Symfony shell completion only supports "%s").</>', supportedShells.join('", "')));
            }

            return __self.INVALID;
        }

        const f = new File(completionFile);
        const file = await f.openFile();
        const contents = (await file.fread(await file.getSize())).toString();
        await file.close();

        output.write(contents.replace(/\{\{ COMMAND_NAME }}/g, commandName).replace(/\{\{ VERSION }}/g, this.application.version));

        return __self.SUCCESS;
    }

    static _guessShell() {
        return basename(process.env.SHELL || '');
    }

    async _tailDebugLog(commandName, output) {
        const fs = new Jymfony.Component.Filesystem.Filesystem();
        const debugFile = tmpdir() + '/jf_' + commandName + '.log';
        if (! await fs.exists(debugFile)) {
            appendFileSync(debugFile, '');
        }

        const tail = spawn('tail', [ '-f', debugFile ], {
            stdio: 'pipe',
        });

        tail.stdout.on('data', data => {
            output.write(data);
        });
        tail.stderr.on('data', data => {
            output.write(data);
        });

        await new Promise(resolve => tail.on('exit', resolve));
    }

    /**
     * @returns {Promise<string[]>}
     */
    async _getSupportedShells() {
        if (null !== this._supportedShells) {
            return this._supportedShells;
        }

        const Filesystem = Jymfony.Component.Filesystem.Filesystem;
        const fs = new Filesystem();

        /** @type {string[]} */
        const dir = await fs.readdir(__dirname + '/../Resources');
        return this._supportedShells = dir
            .filter(file => file.match(/^completion\./))
            .map(file => file.replace(/^completion\.(.+)/, '$1'));
    }
}
