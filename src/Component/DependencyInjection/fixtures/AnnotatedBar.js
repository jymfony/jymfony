/* eslint-disable no-unused-vars */

import { @Inject, @Parameter } from '@jymfony/decorators';

const BarInterface = Jymfony.Component.DependencyInjection.Fixtures.BarInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures
 */
export default class AnnotatedBar extends implementationOf(BarInterface) {
    _qoz = null;

    @Inject('service_container')
    _quz;

    @Parameter('kernel.debug')
    _debug;

    @Inject('service_container')
    set qoz(container) {
        this._qoz = container;
    }
}
