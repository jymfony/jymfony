const DateTime = Jymfony.Component.DateTime.DateTime;
const HeaderBag = Jymfony.Component.HttpFoundation.HeaderBag;

/**
 * @memberOf Jymfony.Component.HttpFoundation
 */
class ResponseHeaderBag extends HeaderBag {
    __construct(headers = {}) {
        super.__construct(headers);

        if (! this.has('cache-control')) {
            this.set('cache-control', '');
        }

        /* RFC2616 - 14.18 says all Responses need to have a Date */
        if (! this.has('date')) {
            this._initDate();
        }
    }

    _initDate() {
        const now = new DateTime(undefined, 'UTC');
        this.set('Date', now.format('D, d M Y H:i:s')+' GMT');
    }
}

module.exports = ResponseHeaderBag;
