const AcceptHeader = Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader;
const BaseAccept = Jymfony.Component.HttpFoundation.Negotiation.BaseAccept;
const InvalidLanguageException = Jymfony.Component.HttpFoundation.Negotiation.Exception.InvalidLanguageException;

/**
 * AcceptCharset header
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 * @final
 */
export default class AcceptLanguage extends mix(BaseAccept, AcceptHeader) {
    /**
     * @inheritdoc
     */
    __construct(value) {
        super.__construct(value);

        this._language = '';
        this._script = '';
        this._region = '';

        const parts = this._type.split('-');
        if (2 === parts.length) {
            this._language = parts[0];
            this._region = parts[1];
        } else if (1 === parts.length) {
            this._language = parts[0];
        } else if (3 === parts.length) {
            this._language = parts[0];
            this._script = parts[1];
            this._region = parts[2];
        } else {
            // TODO: this part is never reached...
            throw new InvalidLanguageException();
        }
    }
    /**
     * @return {string}
     */
    get subPart() {
        return this._region;
    }
    /**
     * @return {string}
     */
    get basePart() {
        return this._language;
    }
}
