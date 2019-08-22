/**
 * @memberOf Jymfony.Component.Logger.Processor
 */
export default class MessageProcessor {
    /**
     * Handle placeholders in message and replaces with context properties.
     *
     * @param {Object.<*>} record
     *
     * @returns {Object.<*>}
     */
    __invoke(record) {
        if (-1 === record.message.indexOf('{')) {
            return record;
        }

        const replacements = {};
        for (const [ key, value ] of __jymfony.getEntries(record.context)) {
            if (isSymbol(key)) {
                continue;
            }

            replacements['{' + key + '}'] = value.toString();
        }

        record.message = __jymfony.strtr(record.message, replacements);

        return record;
    }
}
