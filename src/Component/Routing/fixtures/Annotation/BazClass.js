import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route({ path: '/1', name: 'route1', schemes: [ 'https' ], methods: [ 'GET' ] })
@Route({ path: '/2', name: 'route2', schemes: [ 'https' ], methods: [ 'GET' ] })
export default class BazClass {
    __invoke() { }
}
