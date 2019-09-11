const SecurityExtension = Jymfony.Bundle.SecurityBundle.DependencyInjection.SecurityExtension;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
const JsDumper = Jymfony.Component.DependencyInjection.Dumper.JsDumper;
const { expect } = require('chai');

describe('[SecurityBundle] SecurityExtension', function () {
    beforeEach(() => {
        this.container = new ContainerBuilder(new ParameterBag({
            'kernel.debug': true,
            'kernel.root_dir': __dirname,
            'kernel.project_dir': __dirname,
            'kernel.cache_dir': __dirname + '/cache',
        }));
        this.extension = new SecurityExtension();
    });

    afterEach(() => {
        this.container.compile();

        const dumper = new JsDumper(this.container);
        dumper.dump();
    });

    it('should register console command', () => {
        this.extension.load([
            {
                firewalls: {
                    main: { anonymous: true },
                },
            },
        ], this.container);

        expect(this.container.hasDefinition('security.command.user_password_encoder')).to.be.true;
    });
});
