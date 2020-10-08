/**
 * @memberOf Jymfony.Contracts.Translation
 */
class LocaleAwareInterface {
    /**
     * Sets the current locale.
     *
     * @param {string} locale The locale
     *
     * @throws {InvalidArgumentException} If the locale contains invalid characters
     */
    set locale(locale) { }

    /**
     * Returns the current locale.
     *
     * @returns {string} The locale
     */
    get locale() { }
}

export default getInterface(LocaleAwareInterface);
