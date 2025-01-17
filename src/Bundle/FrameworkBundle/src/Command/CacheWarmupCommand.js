const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const Command = Jymfony.Component.Console.Command.Command;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;

/**
 * Warmup the cache.
 *
 * @final
 * @memberOf Jymfony.Bundle.FrameworkBundle.Command
 */
export default
@AsCommand({ name: 'cache:warmup', description: 'Warms up an empty cache' })
class CacheWarmupCommand extends Command {
    /**
     * @type {Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface}
     *
     * @private
     */
    _cacheWarmer;

    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Kernel.CacheWarmer.CacheWarmerInterface} cacheWarmer
     */
    __construct(cacheWarmer) {
        super.__construct();
        this._cacheWarmer = cacheWarmer;
    }

    /**
     * @inheritdoc
     */
    configure() {
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

        await this._cacheWarmer.warmUp(kernel.container.getParameter('kernel.cache_dir'));

        io.success(__jymfony.sprintf(
            'Cache for the "%s" environment (debug=%s) was successfully warmed.',
            kernel.environment,
            kernel.debug ? 'true' : 'false'
        ));
    }
}
