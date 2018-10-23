/**
 * Trait to get (and set) the URL the user last visited before being forced to authenticate.
 *
 * @memberOf Jymfony.Component.Security.Http
 */
class TargetPathTrait {
    /**
     * Sets the target path the user should be redirected to after authentication.
     *
     * Usually, you do not need to set this directly.
     *
     * @param {Jymfony.Component.HttpFoundation.Session.SessionInterface} session
     * @param {string} providerKey The name of your firewall
     * @param {string} uri The URI to set as the target path
     *
     * @private
     */
    _saveTargetPath(session, providerKey, uri) {
        session.set('_security.' + providerKey + '.target_path', uri);
    }

    /**
     * Returns the URL (if any) the user visited that forced them to login.
     *
     * @param {Jymfony.Component.HttpFoundation.Session.SessionInterface} session
     * @param {string} providerKey The name of your firewall
     *
     * @returns {string}
     *
     * @private
     */
    _getTargetPath(session, providerKey) {
        return session.get('_security.' + providerKey + '.target_path');
    }

    /**
     * Removes the target path from the session.
     *
     * @param {Jymfony.Component.HttpFoundation.Session.SessionInterface} session
     * @param {string} providerKey The name of your firewall
     *
     * @private
     */
    _removeTargetPath(session, providerKey) {
        session.remove('_security.' + providerKey + '.target_path');
    }
}

module.exports = getTrait(TargetPathTrait);
