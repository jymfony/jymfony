const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

const whitelist = [
    'cache.pool',
    'console.command',
    'container.private',
    'container.service_locator',
    'container.service_locator_context',
    'container.service_subscriber',
    'controller.argument_value_resolver',
    'controller.service_arguments',
    'kernel.cache_clearer',
    'kernel.cache_warmer',
    'kernel.event_listener',
    'kernel.event_subscriber',
    'mime.mime_type_guesser',
    'jymfony.logger',
    'routing.loader',
    'security.remember_me_aware',
    'security.voter',
];

/**
 * Find all service tags which are defined, but not used and yield a warning log message.
 *
 * @memberOf Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler
 */
export default class UnusedTagsPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        const tags = new Set([ ...container.findTags(), ...whitelist ]);

        for (const tag of container.findUnusedTags()) {
            // Skip whitelisted tags
            if (whitelist.includes(tag)) {
                continue;
            }

            // Check for typos
            const candidates = [];
            for (const definedTag of tags) {
                if (definedTag === tag) {
                    continue;
                }

                if (-1 !== definedTag.indexOf(tag) || __jymfony.levenshtein(tag, definedTag) <= tag.length / 3) {
                    candidates.push(definedTag);
                }
            }

            const services = Object.keys(container.findTaggedServiceIds(tag));
            let message = __jymfony.sprintf('Tag "%s" was defined on service(s) "%s", but was never used.', tag, services.join('", "'));
            if (0 < candidates.length) {
                message += __jymfony.sprintf(' Did you mean "%s"?', candidates.join('", "'));
            }

            container.log(this, message);
        }
    }
}
