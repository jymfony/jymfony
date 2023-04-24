const DateTime = Jymfony.Component.DateTime.DateTime;
const Envelope = Jymfony.Component.Messenger.Envelope;
const HandleTrait = Jymfony.Component.Messenger.HandleTrait;
const MessageBusInterface = Jymfony.Component.Messenger.MessageBusInterface;

/**
 * @memberOf Jymfony.Component.Messenger
 */
export default class TraceableMessageBus extends implementationOf(MessageBusInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Messenger.MessageBusInterface} decoratedBus
     */
    __construct(decoratedBus) {
        /**
         * @type {Jymfony.Component.Messenger.MessageBusInterface}
         *
         * @private
         */
        this._decoratedBus = decoratedBus;

        /**
         * @type {object[]}
         *
         * @private
         */
        this._dispatchedMessages = [];
    }

    /**
     * @inheritdoc
     */
    async dispatch(message, stamps = []) {
        let envelope = Envelope.wrap(message, stamps);
        const context = {
            stamps: envelope.all(),
            message: envelope.message,
            caller: this.getCaller(),
            callTime: new DateTime().microtime,
        };

        try {
            return envelope = await this._decoratedBus.dispatch(message, stamps);
        } catch (e) {
            context.exception = e;
            throw e;
        } finally {
            this._dispatchedMessages.push({ ...context, stamps_after_dispatch: envelope.all() });
        }
    }

    get dispatchedMessages() {
        return [ ...this._dispatchedMessages ];
    }

    reset() {
        this._dispatchedMessages = [];
    }

    getCaller() {
        const trace = new Exception().stackTrace;

        let file = trace[1].file || null;
        let line = trace[1].line || null;

        const handleTraitFile = new ReflectionClass(HandleTrait).filename;
        let found = false;
        for (let i = 1; 8 > i; ++i) {
            if (!!trace[i].file && !!trace[i + 1].file && trace[i + 1].line && trace[i].file === handleTraitFile) {
                file = trace[i + 1].file;
                line = trace[i + 1].line;
                found = true;

                break;
            }
        }

        for (let i = 2; 8 > i && !found; ++i) {
            debugger;
            if (!! trace[i].class && !! trace[i].function
                && 'dispatch' === trace[i].function
                && new ReflectionClass(trace[i].class).isInstanceOf(MessageBusInterface)
            ) {
                file = trace[i].file;
                line = trace[i].line;

                while (8 > ++i) {
                    if (!! trace[i].function && !! trace[i].file && !trace[i].class && !trace[i].function.startsWith('call_user_func')) {
                        file = trace[i].file;
                        line = trace[i].line;

                        break;
                    }
                }
                break;
            }
        }

        const name = file.replace(/\./g, '/');

        return {
            name: name.substring(name.lastIndexOf('/')),
            file,
            line,
        };
    }
}
