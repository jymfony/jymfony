import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route({ path: { en: '/the/path', nl: '/het/pad' } })
export default class LocalizedMethodActionControllers {
    @Route({ name: 'post', methods: [ 'POST' ] })
    post() {
    }

    @Route({ name: 'put', methods: [ 'PUT' ] })
    put() {
    }
}
