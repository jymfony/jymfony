const ProphecyInterface = Jymfony.Component.Testing.Prophecy.ProphecyInterface;

/**
 * @memberOf Jymfony.Component.Testing.Prophecy
 */
class Revealer {
    /**
     * Unwraps value(s).
     *
     * @param {*} value
     *
     * @returns {*}
     */
    reveal(value) {
        if (isArray(value) || isObjectLiteral(value)) {
            for (let [ key, val ] of __jymfony.getEntries(value)) {
                value[key] = this.reveal(val);
            }

            return value;
        }

        if (value instanceof ProphecyInterface) {
            return value.reveal();
        }

        return value;
    }
}

module.exports = Revealer;
