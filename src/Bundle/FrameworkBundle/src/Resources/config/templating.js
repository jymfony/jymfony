/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

container.register('templating.template_name_parser', Jymfony.Component.Templating.TemplateNameParser);

container.register('templating.loader.chain', Jymfony.Component.Templating.Loader.ChainLoader);
container.register('templating.engine.delegating', Jymfony.Component.Templating.Engine.DelegatingEngine);
