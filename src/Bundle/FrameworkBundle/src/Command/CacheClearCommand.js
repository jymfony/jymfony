const Command = Jymfony.Component.Console.Command.Command;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const ContainerAwareInterface = Jymfony.Component.DependencyInjection.ContainerAwareInterface;
const ContainerAwareTrait = Jymfony.Component.DependencyInjection.ContainerAwareTrait;

const fs = require('fs');

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Command
 */
class CacheClearCommand extends mix(Command, ContainerAwareInterface, ContainerAwareTrait) {
    /**
     * @inheritDoc
     */
    configure() {
        this.name = 'cache:clear';
        this.description = 'Clears the cache';
        this.help = `The <info>%command.name%</info> command clears the application cache for a given environment
and debug mode:

  <info>%command.full_name% --env=dev</info>
  <info>%command.full_name% --env=prod --no-debug</info>`
        ;
    }

    /**
     * @inheritDoc
     */
    execute(input, output) {
        let io = new JymfonyStyle(input, output);

        let realCacheDir = this._container.getParameter('kernel.cache_dir');
        // The old cache dir name must not be longer than the real one to avoid exceeding
        // The maximum length of a directory or file path within it (esp. Windows MAX_PATH)
        let oldCacheDir = realCacheDir.substring(0, realCacheDir.length - 1) + ('~' === realCacheDir.substr(realCacheDir.length - 1) ? '+' : '~');

        try {
            fs.accessSync(realCacheDir, fs.constants.W_OK);
        } catch (e) {
            throw new RuntimeException(__jymfony.sprintf('Unable to write in the "%s" directory', realCacheDir));
        }

        if (fs.exists(oldCacheDir)) {
            fs.unlinkSync(oldCacheDir);
        }

        let kernel = this._container.get('kernel');

        io.comment(__jymfony.sprintf('Clearing the cache for the <info>%s</info> environment with debug <info>%s</info>', kernel.environment, kernel.debug));

        // This._container.get('cache_clearer').clear(realCacheDir);
        fs.renameSync(realCacheDir, oldCacheDir);

        let isOutputVerbose = output.isVerbose();
        if (isOutputVerbose) {
            io.comment('Removing old cache directory...');
        }

        fs.unlinkSync(oldCacheDir);

        if (isOutputVerbose) {
            io.comment('Finished');
        }

        io.success(__jymfony.sprintf('Cache for the "%s" environment (debug=%s) was successfully cleared.', kernel.environment, kernel.debug));
    }
}

module.exports = CacheClearCommand;
