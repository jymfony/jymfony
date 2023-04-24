const StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

/**
 * Stamp used to override the transport names specified in the Messenger routing configuration file.
 *
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class TransportNamesStamp extends implementationOf(StampInterface) {
    /**
     * Constructor.
     *
     * @param {string[]|string} transportNames Transport names to be used for the message
     */
    __construct(transportNames) {
        /**
         * @type {string[]}
         *
         * @private
         */
        this._transportNames = isArray(transportNames) ? transportNames : [ transportNames ];
    }

    /**
     * @returns {string[]}
     */
    get transportNames() {
        return this._transportNames;
    }
}
