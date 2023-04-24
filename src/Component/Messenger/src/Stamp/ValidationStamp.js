const StampInterface = Jymfony.Component.Messenger.Stamp.StampInterface;

/**
 * @memberOf Jymfony.Component.Messenger.Stamp
 * @final
 */
export default class ValidationStamp extends implementationOf(StampInterface) {
    /**
     * Constructor.
     *
     * @param {string[]|Object.<string, string[]>|Jymfony.Component.Validation.Constraints.GroupSequence} groups
     */
    __construct(groups) {
        /**
         * @type {string[]|Object<string, string[]>|Jymfony.Component.Validator.Constraints.GroupSequence}
         *
         * @private
         */
        this._groups = groups;
    }

    /**
     * @returns {string[]|Object<string, string[]>|Jymfony.Component.Validator.Constraints.GroupSequence}
     */
    get groups() {
        return this._groups;
    }
}
