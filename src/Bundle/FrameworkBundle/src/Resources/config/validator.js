/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Container = Jymfony.Component.DependencyInjection.Container;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.setParameter('validator.mapping.cache.file', '%kernel.cache_dir%/validation.js');

container.register(Jymfony.Component.Validator.Validator.ValidatorInterface)
    .setFactory([ new Reference('validator.builder'), 'getValidator' ])
;
container.setAlias('validator', new Alias(Jymfony.Component.Validator.Validator.ValidatorInterface, true));
container.setAlias('validator.mapping.class_metadata_factory', new Alias('validator'));

container.register('validator.builder', Jymfony.Component.Validator.ValidatorBuilder)
    .setFactory('Jymfony.Component.Validator.Validation#createValidatorBuilder')
    .addMethodCall('setConstraintValidatorFactory', [ new Reference('validator.validator_factory') ])
    .addMethodCall('setTranslator', [ new Reference('translator', Container.IGNORE_ON_INVALID_REFERENCE) ])
    .addMethodCall('setTranslationDomain', [ '%validator.translation_domain%' ])
;

container.register('validator.mapping.cache_warmer', Jymfony.Bundle.FrameworkBundle.CacheWarmer.ValidatorCacheWarmer)
    .addArgument(new Reference('validator.builder'))
    .addArgument('%validator.mapping.cache.file%')
    .addTag('kernel.cache_warmer')
;

container.register('validator.mapping.cache.adapter', Jymfony.Component.Cache.Adapter.JsFileAdapter)
    .setFactory('Jymfony.Component.Cache.Adapter.JsFileAdapter#create')
    .addArgument('%validator.mapping.cache.file%')
    .addArgument(new Reference('cache.validator'))
;

container.register('validator.validator_factory', Jymfony.Component.Validator.ContainerConstraintValidatorFactory)
    .addArgument(new Reference('service_container'))
;

container.register('validator.email', Jymfony.Component.Validator.Constraints.EmailValidator)
    .addArgument(undefined)
    .addTag('validator.constraint_validator', {
        'alias': 'Jymfony.Component.Validator.Constraints.EmailValidator',
    });
