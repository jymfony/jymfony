/* eslint-disable no-unused-vars */

const BarInterface = Jymfony.Component.DependencyInjection.Fixtures.BarInterface;
const Inject = Jymfony.Component.DependencyInjection.Annotation.Inject;
const Parameter = Jymfony.Component.DependencyInjection.Annotation.Parameter;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures
 */
export default class AnnotatedBar extends implementationOf(BarInterface) {
    _qoz = null;

    @Inject('service_container')
    accessor _quz;

    @Parameter('kernel.debug')
    accessor _debug;

    @Inject('service_container')
    set qoz(container) {
        this._qoz = container;
    }
}
