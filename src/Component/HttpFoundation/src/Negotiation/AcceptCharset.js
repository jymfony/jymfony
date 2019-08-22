const AcceptHeader = Jymfony.Component.HttpFoundation.Negotiation.AcceptHeader;
const BaseAccept = Jymfony.Component.HttpFoundation.Negotiation.BaseAccept;

/**
 * AcceptCharset header
 *
 * @memberOf Jymfony.Component.HttpFoundation.Negotiation
 * @final
 */
export default class AcceptCharset extends mix(BaseAccept, AcceptHeader) {
}
