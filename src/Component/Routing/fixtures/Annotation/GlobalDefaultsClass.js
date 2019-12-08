import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route({ path: '/defaults', locale: 'g_locale', format: 'g_format' })
export default class GlobalDefaultsClass {
    @Route({ path: '/specific-locale', name: 'specific_locale', locale: 's_locale' })
    locale() {
    }

    @Route({ path: '/specific-format', name: 'specific_format', format: 's_format' })
    format() {
    }
}
