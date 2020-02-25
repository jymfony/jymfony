/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Container = Jymfony.Component.DependencyInjection.Container;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('error_handler.error_renderer.html', Jymfony.Component.Debug.ErrorRenderer.HtmlErrorRenderer)
    .addArgument('%kernel.debug%')
    .addArgument('%kernel.project_dir%')
    .addArgument(new Reference('logger', Container.NULL_ON_INVALID_REFERENCE))
;

container.setAlias('error_handler.html', new Alias('error_handler.error_renderer.html'));
