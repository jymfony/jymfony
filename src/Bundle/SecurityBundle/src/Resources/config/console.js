/** @global container */
/** @var {Jymfony.Component.DependencyInjection.ContainerBuilder} container */

container.register('security.command.user_password_encoder', Jymfony.Bundle.SecurityBundle.Command.UserPasswordEncoderCommand)
    .addArgument(Jymfony.Component.Security.Encoder.EncoderFactoryInterface)
    .addArgument() // User classes
    .addTag('console.command')
;
