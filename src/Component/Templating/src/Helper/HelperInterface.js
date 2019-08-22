/**
 * HelperInterface is the interface all helpers must implement.
 *
 * @memberOf Jymfony.Component.Templating.Helper
 */
class HelperInterface {
    /**
     * Returns the name of this helper.
     *
     * @returns {string}
     */
    get name() { }
}

export default getInterface(HelperInterface);
