/**
 * @memberOf Jymfony.Component.DateTime.Internal
 */
export default class Rule {
    /**
     * Constructor.
     *
     * @param {int} fromYear
     * @param {int} toYear
     * @param {int} inMonth
     * @param {string} on
     * @param {string} at
     * @param {int} save
     * @param {string} letters
     */
    __construct(fromYear, toYear, inMonth, on, at, save, letters) {
        /**
         * @type {int}
         *
         * @private
         */
        this._fromYear = fromYear;

        /**
         * @type {int}
         *
         * @private
         */
        this._toYear = toYear;

        /**
         * @type {int}
         *
         * @private
         */
        this._inMonth = inMonth;

        /**
         * @type {string}
         *
         * @private
         */
        this._on = on;

        /**
         * @type {string}
         *
         * @private
         */
        this._at = at;

        /**
         * @type {int}
         *
         * @private
         */
        this._save = save;

        /**
         * @type {string}
         *
         * @private
         */
        this._letters = letters;
    }

    /**
     * Gets the initial year (inclusive).
     *
     * @return {int}
     */
    get fromYear() {
        return this._fromYear;
    }

    /**
     * Gets the end year (inclusive).
     *
     * @return {int}
     */
    get toYear() {
        return this._toYear;
    }

    /**
     * Gets the transition day month.
     *
     * @return {int}
     */
    get month() {
        return this._inMonth;
    }

    /**
     * Gets the DST offset.
     *
     * @returns {int}
     */
    get save() {
        return this._save;
    }

    /**
     * Gets the transition time.
     *
     * @returns {string}
     */
    get at() {
        return this._at;
    }

    /**
     * Gets the rule letter(s).
     *
     * @returns {string}
     */
    get letters() {
        return this._letters;
    }

    /**
     * Whether this rule is applied before the other one.
     *
     * @param {Rule} other
     */
    before(other) {
        if (this.toYear < other.toYear) {
            return true;
        }

        if (this.month < other.month) {
            return true;
        }

        return false;
    }

    /**
     * Gets the transition time as string.
     *
     * @param {int} year
     *
     * @return {[string, string]}
     */
    getTransitionTime(year) {
        if (year < this._fromYear) {
            return null;
        }

        if (year > this._toYear) {
            year = this._toYear;
        }

        let on;
        if (-1 !== this._on.indexOf('%s')) {
            let onStr = '';
            switch (this._inMonth) {
                case 1: onStr += 'jan'; break;
                case 2: onStr += 'feb'; break;
                case 3: onStr += 'mar'; break;
                case 4: onStr += 'apr'; break;
                case 5: onStr += 'may'; break;
                case 6: onStr += 'jun'; break;
                case 7: onStr += 'jul'; break;
                case 8: onStr += 'aug'; break;
                case 9: onStr += 'sep'; break;
                case 10: onStr += 'oct'; break;
                case 11: onStr += 'nov'; break;
                case 12: onStr += 'dec'; break;
            }

            onStr += ' ' + String(year);
            on = __jymfony.sprintf(this._on, onStr);
        } else {
            on = __jymfony.sprintf('%04d-%02d-%02d', year, this._inMonth, this._on);
        }

        const parser = new Jymfony.Component.DateTime.Parser.Parser();
        const tm = parser.parse(on + ' ' + this._at.replace(/[uws]$/, ''));

        const transitionTime = __jymfony.sprintf('%06d-%02d-%02dT%02d:%02d:%02d%s', tm._year, tm.month, tm.day, tm.hour, tm.minutes, tm.seconds, this._at.endsWith('u') ? 'u' : '');
        if (0 === this._save) {
            return [ transitionTime, transitionTime.replace(/u$/, '') ];
        }

        tm._addSeconds(this._save);
        const withSave = __jymfony.sprintf('%06d-%02d-%02dT%02d:%02d:%02d', tm._year, tm.month, tm.day, tm.hour, tm.minutes, tm.seconds);

        return [ transitionTime, withSave ];
    }
}
