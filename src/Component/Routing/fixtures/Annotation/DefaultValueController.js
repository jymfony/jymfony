const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default class DefaultValueController {
    @Route({ path: '/{$default}/path', name: 'action' })
    action($default = 'value') { // eslint-disable-line no-unused-vars
    }

    @Route({ path: '/hello/{name<\w+>}', name: 'hello_without_default' })
    @Route({ path: '/hello/{name<\w+>?Jymfony}', name: 'hello_with_default' })
    hello(name = 'World') { // eslint-disable-line no-unused-vars
    }
}
