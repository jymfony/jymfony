/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

const Reference = Jymfony.Component.DependencyInjection.Reference;

container.register('security.command.user_password_encoder', Jymfony.Bundle.SecurityBundle.Command.UserPasswordEncoderCommand)
    .addArgument(new Reference(Jymfony.Component.Security.Encoder.EncoderFactoryInterface))
    .addArgument() // User classes
    .addTag('console.command')
;
