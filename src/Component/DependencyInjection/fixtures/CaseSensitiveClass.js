/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures
 */
class CaseSensitiveClass {
    __construct(identifier = null) {
        this._identifier = identifier;
    }
}

module.exports = CaseSensitiveClass;
