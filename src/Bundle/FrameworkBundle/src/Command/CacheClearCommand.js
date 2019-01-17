const Command = Jymfony.Component.Console.Command.Command;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const ContainerAwareInterface = Jymfony.Component.DependencyInjection.ContainerAwareInterface;
const ContainerAwareTrait = Jymfony.Component.DependencyInjection.ContainerAwareTrait;
const RecursiveDirectoryIterator = Jymfony.Component.Filesystem.Iterator.RecursiveDirectoryIterator;
const File = Jymfony.Component.Filesystem.File;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;

const path = require('path');

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Command
 */
class CacheClearCommand extends mix(Command, ContainerAwareInterface, ContainerAwareTrait) {
    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'cache:clear';
        this.description = 'Clears the cache';
        this.addOption('no-warmup', null, InputOption.VALUE_NONE, 'Do not warm up the cache');
        this.addOption('no-optional-warmers', '', InputOption.VALUE_NONE, 'Skip optional cache warmers (faster)');

        this.help = `The <info>%command.name%</info> command clears the application cache for a given environment and debug mode:

  <info>%command.full_name% --env=dev</info>
  <info>%command.full_name% --env=prod --no-debug</info>`
        ;
    }

    /**
     * @inheritdoc
     */
    async execute(input, output) {
        const io = new JymfonyStyle(input, output);
        const isOutputVerbose = output.isVerbose();

        const fs = new Filesystem();

        const realCacheDir = this._container.getParameter('kernel.cache_dir');
        // The old cache dir name must not be longer than the real one to avoid exceeding
        // The maximum length of a directory or file path within it (esp. Windows MAX_PATH)
        const oldCacheDir = realCacheDir.substring(0, realCacheDir.length - 1) + ('~' === realCacheDir.substr(realCacheDir.length - 1) ? '+' : '~');

        if (! (await fs.isWritable(realCacheDir))) {
            throw new RuntimeException(__jymfony.sprintf('Unable to write in the "%s" directory', realCacheDir));
        }

        if (await fs.exists(oldCacheDir)) {
            await fs.remove(oldCacheDir);
        }

        const kernel = this._container.get('kernel');
        io.comment(__jymfony.sprintf('Clearing the cache for the <info>%s</info> environment with debug <info>%s</info>', kernel.environment, kernel.debug));

        this._container.get('cache_clearer').clear(realCacheDir);

        // The current event dispatcher is stale, let's not use it anymore
        this.application.dispatcher = new EventDispatcher();

        const containerFile = (new ReflectionClass(this._container)).filename;
        const containerDir = path.basename(path.dirname(containerFile));

        // The warmup cache dir name must have the same length as the real one
        // To avoid the many problems in serialized resources files
        const warmupDir = realCacheDir.substr(0, realCacheDir.length - 1) + ('_' === realCacheDir[realCacheDir.length - 1] ? '-' : '_');

        if (await fs.exists(warmupDir)) {
            if (isOutputVerbose) {
                io.comment('Clearing outdated warmup directory...');
            }

            await fs.remove(warmupDir);
        }

        await fs.mkdir(warmupDir);

        if (! input.getOption('no-warmup')) {
            if (isOutputVerbose) {
                io.comment('Warming up cache...');
            }

            await this._warmup(warmupDir, realCacheDir, ! input.getOption('no-optional-warmers'));
        }

        if (! await fs.exists(warmupDir + '/' + containerDir)) {
            await fs.rename(realCacheDir + '/' + containerDir, warmupDir + '/' + containerDir);
        }

        if (oldCacheDir) {
            await fs.rename(realCacheDir, oldCacheDir);
        } else {
            await fs.remove(realCacheDir);
        }

        await fs.rename(warmupDir, realCacheDir);

        if (isOutputVerbose) {
            io.comment('Removing old cache directory...');
        }

        try {
            await fs.remove(oldCacheDir);
        } catch (e) {
            if (isOutputVerbose) {
                io.warning(e.message);
            }
        }

        if (isOutputVerbose) {
            io.comment('Finished');
        }

        io.success(__jymfony.sprintf('Cache for the "%s" environment (debug=%s) was successfully cleared.', kernel.environment, kernel.debug));
    }

    /**
     * Warms up the cache.
     *
     * @param {string} warmupDir
     * @param {string} realCacheDir
     * @param {boolean} enableOptionalWarmers
     *
     * @returns {Promise<void>}
     *
     * @private
     */
    async _warmup(warmupDir, realCacheDir, enableOptionalWarmers = true) {
        // Create a temporary kernel
        const kernel = this.application.kernel;
        await kernel.reboot(warmupDir);

        // Warmup temporary dir
        if (enableOptionalWarmers) {
            const warmer = kernel.container.get('cache_warmer');
            // Non optional warmers already ran during container compilation
            warmer.enableOptionalWarmers();
            await warmer.warmUp(warmupDir);
        }

        // Fix references to cached files with the real cache directory name
        const search = new RegExp(__jymfony.regex_quote(warmupDir) + '|' + __jymfony.regex_quote(warmupDir.replace('\\', '\\\\')), 'g');
        const replace = realCacheDir.replace('\\', '/');

        const warmupIterator = new RecursiveDirectoryIterator(warmupDir);
        await __jymfony.forAwait(warmupIterator, async file => {
            file = new File(file);

            const h = await file.openFile('r');
            const content = (await h.fread(await file.getSize())).toString();
            await h.close();

            const wh = await file.openFile('w');
            await wh.fwrite(Buffer.from(content.replace(search, replace)));
            await wh.close();
        });
    }
}

module.exports = CacheClearCommand;
