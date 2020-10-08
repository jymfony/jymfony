/**
 * @memberOf Jymfony.Component.Validator.Util
 */
export default class PropertyPath {
    constructor() {
        throw new Error('Not instantiable');
    }

    /**
     * Appends a path to a given property path.
     *
     * If the base path is empty, the appended path will be returned unchanged.
     * If the base path is not empty, and the appended path starts with a
     * squared opening bracket ("["), the concatenation of the two paths is
     * returned. Otherwise, the concatenation of the two paths is returned,
     * separated by a dot (".").
     *
     * @returns {string} The concatenation of the two property paths
     */
    static append(basePath, subPath) {
        if ('' !== subPath) {
            if ('[' === subPath[0]) {
                return basePath + subPath;
            }

            return '' !== basePath ? basePath + '.' + subPath : subPath;
        }

        return basePath;
    }
}
