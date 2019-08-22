const ProphecyInterface = Jymfony.Component.Testing.Prophecy.ProphecyInterface;

/**
 * @memberOf Jymfony.Component.Testing.Prophecy
 */
export default class Revealer {
    /**
     * Unwraps value(s).
     *
     * @param {*} value
     *
     * @returns {*}
     */
    reveal(value) {
        if (isArray(value) || isObjectLiteral(value)) {
            for (const [ key, val ] of __jymfony.getEntries(value)) {
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
