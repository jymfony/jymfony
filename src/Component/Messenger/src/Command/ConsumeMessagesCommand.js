const ChoiceQuestion = Jymfony.Component.Console.Question.ChoiceQuestion;
const Command = Jymfony.Component.Console.Command.Command;
const ConsoleOutputInterface = Jymfony.Component.Console.Output.ConsoleOutputInterface;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const InvalidOptionException = Jymfony.Component.Console.Exception.InvalidOptionException;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const StopWorkerOnMessageLimitListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnMessageLimitListener;
const StopWorkerOnTimeLimitListener = Jymfony.Component.Messenger.EventListener.StopWorkerOnTimeLimitListener;
const Worker = Jymfony.Component.Messenger.Worker;

/**
 * @memberOf Jymfony.Component.Messenger.Command
 */
export default class ConsumeMessagesCommand extends Command {
    /**
     * @param {Jymfony.Component.Messenger.RoutableMessageBus} routableBus
     * @param {Jymfony.Component.DependencyInjection.ContainerInterface} receiverLocator
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} eventDispatcher
     * @param {Jymfony.Contracts.Logger.LoggerInterface} [logger = null]
     * @param {string[]} [receiverNames = []]
     * @param {string[]} [busIds = []]
     */
    __construct(routableBus, receiverLocator, eventDispatcher, logger = null, receiverNames = [], busIds = []) {
        /**
         * @type {Jymfony.Component.Messenger.RoutableMessageBus}
         *
         * @private
         */
        this._routableBus = routableBus;

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerInterface}
         *
         * @private
         */
        this._receiverLocator = receiverLocator;

        /**
         * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
         *
         * @private
         */
        this._eventDispatcher = eventDispatcher;

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._logger = logger;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._receiverNames = receiverNames;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._busIds = busIds;

        super.__construct();
    }

    static get defaultName() {
        return 'messenger:consume';
    }

    /**
     * @inheritdoc
     */
    configure() {
        const defaultReceiverName = 1 === this._receiverNames.length ? this._receiverNames[0] : null;

        this.description = 'Consume messages';
        this.definition = [
            new InputArgument('receivers', InputArgument.IS_ARRAY, 'Names of the receivers/transports to consume in order of priority', defaultReceiverName ? [ defaultReceiverName ] : []),
            new InputOption('limit', 'l', InputOption.VALUE_REQUIRED, 'Limit the number of received messages'),
            new InputOption('failure-limit', 'f', InputOption.VALUE_REQUIRED, 'The number of failed messages the worker can consume'),
            new InputOption('memory-limit', 'm', InputOption.VALUE_REQUIRED, 'The memory limit the worker can consume'),
            new InputOption('time-limit', 't', InputOption.VALUE_REQUIRED, 'The time limit in seconds the worker can handle new messages'),
            new InputOption('sleep', null, InputOption.VALUE_REQUIRED, 'Seconds to sleep before asking for new messages after no messages were found', 1),
            new InputOption('bus', 'b', InputOption.VALUE_REQUIRED, 'Name of the bus to which received messages should be dispatched (if not passed, bus is determined automatically)'),
            new InputOption('queues', null, InputOption.VALUE_REQUIRED | InputOption.VALUE_IS_ARRAY, 'Limit receivers to only consume from the specified queues'),
        ];

        this.help = `The <info>%command.name%</info> command consumes messages and dispatches them to the message bus.

    <info>%command.full_name% <receiver-name></info>

To receive from multiple transports, pass each name:

    <info>%command.full_name% receiver1 receiver2</info>

Use the --limit option to limit the number of messages received:

    <info>%command.full_name% <receiver-name> --limit=10</info>

Use the --failure-limit option to stop the worker when the given number of failed messages is reached:

    <info>%command.full_name% <receiver-name> --failure-limit=2</info>

Use the --memory-limit option to stop the worker if it exceeds a given memory usage limit. You can use shorthand byte values [K, M or G]:

    <info>%command.full_name% <receiver-name> --memory-limit=128M</info>

Use the --time-limit option to stop the worker when the given time limit (in seconds) is reached.
If a message is being handled, the worker will stop after the processing is finished:

    <info>%command.full_name% <receiver-name> --time-limit=3600</info>

Use the --bus option to specify the message bus to dispatch received messages
to instead of trying to determine it automatically. This is required if the
messages didn't originate from Messenger:

    <info>%command.full_name% <receiver-name> --bus=event_bus</info>

Use the --queues option to limit a receiver to only certain queues (only supported by some receivers):

    <info>%command.full_name% <receiver-name> --queues=fasttrack</info>

Use the --no-reset option to prevent services resetting after each message (may lead to leaking services' state between messages):

    <info>%command.full_name% <receiver-name> --no-reset</info>
`;
    }

    /**
     * @inheritdoc
     */
    async interact(input, output) {
        const io = new JymfonyStyle(input, output instanceof ConsoleOutputInterface ? output.errorOutput : output);

        if (this._receiverNames && !input.getArgument('receivers')) {
            io.block('Which transports/receivers do you want to consume?', null, 'fg=white;bg=blue', ' ', true);

            io.writeln('Choose which receivers you want to consume messages from in order of priority.');
            if (1 < this._receiverNames.length) {
                io.writeln(__jymfony.sprintf('Hint: to consume from multiple, use a list of their names, e.g. <comment>%s</comment>', this._receiverNames.join(', ')));
            }

            const question = new ChoiceQuestion(input, output, 'Select receivers to consume:', this._receiverNames);
            question.multiple = true;

            input.setArgument('receivers', await question.ask());
        }

        if (!input.getArgument('receivers')) {
            throw new RuntimeException('Please pass at least one receiver.');
        }
    }

    /**
     * @inheritdoc
     */
    async execute(input, output) {
        const receivers = {};
        const receiverNames = input.getArgument('receivers');

        for (const receiverName of receiverNames) {
            if (!this._receiverLocator.has(receiverName)) {
                let message = __jymfony.sprintf('The receiver "%s" does not exist.', receiverName);
                if (this._receiverNames) {
                    message += __jymfony.sprintf(' Valid receivers are: %s.', this._receiverNames.join(', '));
                }

                throw new RuntimeException(message);
            }

            receivers[receiverName] = await this._receiverLocator.get(receiverName);
        }

        let stopsWhen = [];
        const limit = input.getOption('limit');
        if (undefined !== limit && null !== limit) {
            if (!isNumeric(limit) || 0 >= limit) {
                throw new InvalidOptionException(__jymfony.sprintf('Option "limit" must be a positive integer, "%s" passed.', limit));
            }

            stopsWhen.push(__jymfony.sprintf('processed %d messages', limit));
            this._eventDispatcher.addSubscriber(new StopWorkerOnMessageLimitListener(limit, this._logger));
        }

        // If ($failureLimit = $input->getOption('failure-limit')) {
        //     $stopsWhen[] = "reached {$failureLimit} failed messages";
        //     This._eventDispatcher->addSubscriber(new StopWorkerOnFailureLimitListener($failureLimit, this._logger));
        // }
        //
        // If ($memoryLimit = $input->getOption('memory-limit')) {
        //     $stopsWhen[] = "exceeded {$memoryLimit} of memory";
        //     This._eventDispatcher->addSubscriber(new StopWorkerOnMemoryLimitListener(this._convertToBytes($memoryLimit), this._logger));
        // }
        //
        const timeLimit = input.getOption('time-limit');
        if (null !== timeLimit) {
            if (!isNumeric(timeLimit) || 0 >= timeLimit) {
                throw new InvalidOptionException(__jymfony.sprintf('Option "time-limit" must be a positive integer, "%s" passed.', timeLimit));
            }

            stopsWhen.push(`been running for ${timeLimit}s`);
            this._eventDispatcher.addSubscriber(new StopWorkerOnTimeLimitListener(timeLimit, this._logger));
        }

        stopsWhen.push('received a stop signal via the messenger:stop-workers command');

        const io = new JymfonyStyle(input, output instanceof ConsoleOutputInterface ? output.errorOutput : output);
        io.success(__jymfony.sprintf('Consuming messages from transport%s "%s".', 1 < receivers.length ? 's' : '', receiverNames.join(', ')));

        if (stopsWhen) {
            const last = stopsWhen.pop();
            stopsWhen = (stopsWhen.length ? stopsWhen.join(', ') + ' or ' : '') + last;
            io.comment(__jymfony.sprintf('The worker will automatically exit once it has %s.', stopsWhen));
        }

        io.comment('Quit the worker with CONTROL-C.');

        if (OutputInterface.VERBOSITY_VERBOSE > output.verbosity) {
            io.comment('Re-run the command with a -vv option to see logs about consumed messages.');
        }

        const bus = input.getOption('bus') ? this._routableBus.getMessageBus(input.getOption('bus')) : this._routableBus;

        const worker = new Worker(receivers, bus, this._eventDispatcher, this._logger);
        const options = {
            sleep: input.getOption('sleep') * 1000000,
        };

        const queues = input.getOption('queues');
        if (0 < queues.length) {
            options.queues = queues;
        }

        await worker.run(options);

        return 0;
    }

    _convertToBytes(memoryLimit) {
        memoryLimit = memoryLimit.toLowerCase();
        let max = __jymfony.ltrim(memoryLimit, '+');
        if (max.startsWith('0x')) {
            max = Number.parseInt(max, 16);
        } else if (max.startsWith('0')) {
            max = Number.parseInt(max, 8);
        } else {
            max = ~~max;
        }

        switch (__jymfony.rtrim(memoryLimit, 'b').split('').reverse().join('')[0]) {
            case 't': max *= 1024;
            // No break
            case 'g': max *= 1024;
            // No break
            case 'm': max *= 1024;
            // No break
            case 'k': max *= 1024;
        }

        return max;
    }
}
