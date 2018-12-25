/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('templating.engine.js', Jymfony.Component.Templating.Engine.JsEngine)
    .addArgument(new Reference('templating.template_name_parser'))
    .addArgument(new Reference('templating.loader'))
;
