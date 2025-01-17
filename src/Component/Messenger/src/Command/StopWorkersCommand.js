const AsCommand = Jymfony.Component.Console.Annotation.AsCommand;
const Command = Jymfony.Component.Console.Command.Command;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const DateTime = Jymfony.Component.DateTime.DateTime;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const StopWorkerOnRestartSignalListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnRestartSignalListener;

/**
 * @memberOf Jymfony.Component.Messenger.Command
 */
export default
@AsCommand({ name: 'messenger:stop-workers', description: 'Stop workers after their current message' })
class StopWorkersCommand extends Command {
    /**
     * @type {Jymfony.Contracts.Cache.CacheItemPoolInterface}
     *
     * @private
     */
    _restartSignalCachePool;

    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Cache.CacheItemPoolInterface} restartSignalCachePool
     */
    __construct(restartSignalCachePool) {
        this._restartSignalCachePool = restartSignalCachePool;

        super.__construct();
    }

    /**
     * @inheritDoc
     */
    configure() {
        this.help = `The <info>%command.name%</info> command sends a signal to stop any <info>messenger:consume</info> processes that are running.

    <info>%command.full_name%</info>

Each worker command will finish the message they are currently processing
and then exit. Worker commands are *not* automatically restarted: that
should be handled by a process control system.
`;
    }

    /**
     * @inheritdoc
     */
    async execute(input, output) {
        const io = new JymfonyStyle(input, output instanceof ConsoleOutputInterface ? output.errorOutput : output);

        const cacheItem = await this._restartSignalCachePool.getItem(StopWorkerOnRestartSignalListener.RESTART_REQUESTED_TIMESTAMP_KEY);
        cacheItem.set(DateTime.now.microtime);
        await this._restartSignalCachePool.save(cacheItem);

        io.success('Signal successfully sent to stop any running workers.');

        return 0;
    }
}
