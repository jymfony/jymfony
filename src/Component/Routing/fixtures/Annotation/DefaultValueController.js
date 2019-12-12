import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default class DefaultValueController {
    @Route({ path: "/{$default}/path", name: "action" })
    action($default = 'value') {
    }

    @Route({ path: "/hello/{name<\w+>}", name: "hello_without_default" })
    @Route({ path: "/hello/{name<\w+>?Jymfony}", name: "hello_with_default" })
    hello(name = 'World') {
    }
}
