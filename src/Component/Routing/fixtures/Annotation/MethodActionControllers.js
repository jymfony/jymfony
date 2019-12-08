import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route("/the/path")
export default class MethodActionControllers {
    @Route({ name: 'post', methods: [ 'POST' ] })
    post() {
    }

    @Route({ name: 'put', methods: [ 'PUT' ] })
    put() {
    }
}
