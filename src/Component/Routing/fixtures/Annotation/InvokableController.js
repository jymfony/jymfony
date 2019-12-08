import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route({ path: '/here', name: 'lol', methods: ["GET", "POST"], schemes: ["https"] })
export default class InvokableController {
    __invoke() {
    }
}
