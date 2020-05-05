/**
 * @memberOf Jymfony.Component.DateTime.Internal
 */
export default class RuleSet {
    /**
     * Constructor.
     *
     * @param {string} name
     */
    __construct(name) {
        /**
         * @type {string}
         *
         * @private
         */
        this._name = name;

        /**
         * @type {Jymfony.Component.DateTime.Internal.Rule[]}
         *
         * @private
         */
        this._rules = [];
    }

    /**
     * Gets the ruleset name.
     *
     * @return {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Adds a rule.
     *
     * @param {Rule} rule
     */
    push(rule) {
        this._rules.push(rule);
    }

    /**
     * Gets all the possible rules for the given year.
     *
     * @param {int} year
     *
     * @returns {Jymfony.Component.DateTime.Internal.Rule[]}
     */
    getRulesForYear(year) {
        let lastRule = null;

        const rules = [];
        for (const rule of this._rules) {
            if (rule.toYear >= year && rule.fromYear <= year) {
                rules.push(rule);
            } else if (rule.toYear < year && (null === lastRule || lastRule.before(rule))) {
                lastRule = rule;
            }
        }

        if (null !== lastRule) {
            rules.unshift(lastRule);
        }

        return rules;
    }
}
