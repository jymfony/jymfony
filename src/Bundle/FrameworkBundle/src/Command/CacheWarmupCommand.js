const Command = Jymfony.Component.Console.Command.Command;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;

/**
 * Warmup the cache.
 *
 * @final
 * @memberOf Jymfony.Bundle.FrameworkBundle.Command
 */
class CacheWarmupCommand extends Command {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface} cacheWarmer
     */
    __construct(cacheWarmer) {
        super.__construct();

        /**
         * @type {Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface}
         *
         * @private
         */
        this._cacheWarmer = cacheWarmer;
    }

    /**
     * @inheritdoc
     */
    configure() {
        this.name = 'cache:warmup';
        this.description = 'Warms up an empty cache';
        this.help = `The <info>%command.name%</info> command warms up the cache.

Before running this command, the cache must be empty.
`;

        this.addOption('no-optional-warmers', '', InputOption.VALUE_NONE, 'Skip optional cache warmers (faster)');
    }

    /**
     * @inheritdoc
     */
    async execute(input, output) {
        const io = new JymfonyStyle(input, output);
        const kernel = this.application.kernel;

        io.comment(__jymfony.sprintf(
            'Warming up the cache for the <info>%s</info> environment with debug <info>%s</info>',
            kernel.environment,
            kernel.debug ? 'true' : 'false'
        ));

        if (! input.getOption('no-optional-warmers')) {
            this._cacheWarmer.enableOptionalWarmers();
        }

        this._cacheWarmer.warmUp(kernel.container.getParameter('kernel.cache_dir'));

        io.success(__jymfony.sprintf(
            'Cache for the "%s" environment (debug=%s) was successfully warmed.',
            kernel.environment,
            kernel.debug ? 'true' : 'false'
        ));
    }
}

module.exports = CacheWarmupCommand;
