const Acknowledger = Jymfony.Component.Messenger.Handler.Acknowledger;

/**
 * @memberOf Jymfony.Component.Messenger.Handler
 */
class BatchHandlerTrait {
    __construct() {
        /**
         * @type {*[]}
         *
         * @private
         */
        this._jobs = [];
    }

    /**
     * @inheritdoc
     */
    async flush() {
        const jobs = this._jobs;
        if (0 < jobs.length) {
            this._jobs = [];
            await this._process(jobs);
        }
    }

    /**
     * @param {object} message
     * @param {Jymfony.Component.Messenger.Handler.Acknowledger|null} ack
     *              The function to call to ack/nack the message.
     *              The message should be handled synchronously when null.
     *
     * @returns {*} The number of pending messages in the batch if $ack is not null,
     *              the result from handling the message otherwise
     */
    async _handle(message, ack = null) {
        if (null === ack) {
            ack = new Acknowledger(ReflectionClass.getClassName(this));
            this._jobs.push([ message, ack ]);
            await this.flush(true);

            return ack.result;
        }

        this._jobs.push([ message, ack ]);
        if (!this._shouldFlush()) {
            return this._jobs.length;
        }

        await this.flush(true);

        return 0;
    }

    _shouldFlush() {
        return 10 <= this._jobs.length;
    }

    /**
     * Completes the jobs in the list.
     *
     * @param {[object, Jymfony.Component.Messenger.Handler.Acknowledger][]} jobs A list of pairs of messages and their corresponding acknowledgers
     */
    async _process(jobs) { // eslint-disable-line no-unused-vars
        throw new LogicException('_process method must be implemented');
    }
}

export default getTrait(BatchHandlerTrait);
