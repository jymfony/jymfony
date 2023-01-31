/** @global {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Alias = Jymfony.Component.DependencyInjection.Alias;
const Container = Jymfony.Component.DependencyInjection.Container;
const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('http_client', Jymfony.Contracts.HttpClient.HttpClientInterface)
    .setFactory('Jymfony.Component.HttpClient.HttpClient#create')
    .setArguments([
        [], // Default options
    ])
    .addMethodCall('setLogger', [ new Reference('logger', Container.IGNORE_ON_INVALID_REFERENCE) ])
    .addTag('jymfony.logger', { channel: 'http_client' })
    .addTag('http_client.client');

container.setAlias(Jymfony.Contracts.HttpClient.HttpClientInterface, 'http_client');

container.register('http_client.abstract_retry_strategy', Jymfony.Component.HttpClient.Retry.GenericRetryStrategy)
    .setAbstract(true)
    .setArguments([
        null, // Http codes
        null, // Delay ms
        null, // Multiplier
        null, // Max delay ms
        null, // Jitter
    ]);
