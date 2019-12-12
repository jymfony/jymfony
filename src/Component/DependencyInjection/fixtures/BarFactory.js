/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures
 */
export default class BarFactory {
    __construct(bars) {
        this._bars = [ ...bars ];
    }

    getDefaultBar() {
        return this._bars[0];
    }
}
