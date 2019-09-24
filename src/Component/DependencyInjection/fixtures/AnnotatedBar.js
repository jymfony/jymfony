/* eslint-disable no-unused-vars */

import { @Inject, @Parameter } from '../decorators';

const BarInterface = Jymfony.Component.DependencyInjection.Fixtures.BarInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Fixtures
 */
export default class AnnotatedBar extends implementationOf(BarInterface) {
    @Inject('service_container')
    _quz;

    @Parameter('kernel.debug')
    _debug;
}
