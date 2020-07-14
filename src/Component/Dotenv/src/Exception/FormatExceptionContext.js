/**
 * @memberOf Jymfony.Component.Dotenv.Exception
 */
export default class FormatExceptionContext {
    /**
     * Constructor.
     *
     * @param {string} data
     * @param {string} path
     * @param {int} lineno
     * @param {int} cursor
     */
    __construct(data, path, lineno, cursor) {
        this._data = data;
        this._path = path;
        this._lineno = lineno;
        this._cursor = cursor;
    }

    get path() {
        return this._path;
    }

    get lineNo() {
        return this._lineno;
    }

    get details() {
        const before = this._data.substr(Math.max(0, this._cursor - 20), Math.min(20, this._cursor)).replace(/\n/g, '\\n');
        const after = this._data.substr(this._cursor, 20).replace(/\n/g, '\\n');

        return '...' + before + after + '...\n' + ' '.repeat(before.length + 2) + '^ line ' + this._lineno + ' offset ' + this._cursor;
    }
}
