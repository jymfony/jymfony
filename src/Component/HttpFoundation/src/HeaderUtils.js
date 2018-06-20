/**
 * @memberOf Jymfony.Component.HttpFoundation
 */
class HeaderUtils {
    /**
     * Joins an object into a string for use in an HTTP header
     *
     * @param {Object.<string, string>} obj
     * @param {string} separator
     *
     * @returns {string}
     */
    static toString(obj, separator) {
        const parts = [];
        Object.ksort(obj);
        for (let [ key, value ] of __jymfony.getEntries(obj)) {
            if (true === value) {
                parts.push(key);
            } else {
                if (value.match(/[^a-zA-Z0-9._-]/)) {
                    value = '"'+value+'"';
                }

                parts.push(key + '=' + value);
            }
        }

        return parts.join(separator + ' ');
    }
}

module.exports = HeaderUtils;
