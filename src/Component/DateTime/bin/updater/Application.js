import { dirname, relative, resolve } from 'path';
import { Linter } from 'eslint';
import linterConfig from '../.eslintrc.json';

const ArchiveReader = App.ArchiveReader;
const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const IOException = Jymfony.Component.Filesystem.Exception.IOException;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const OpenFile = Jymfony.Component.Filesystem.OpenFile;
const Parser = App.Parser;
const SingleCommandApplication = Jymfony.Component.Console.SingleCommandApplication;
const VarExporter = Jymfony.Component.VarExporter.VarExporter;

export default class Application extends SingleCommandApplication {
    __construct(name = undefined) {
        super.__construct(name);

        /**
         * @type {ArchiveReader}
         *
         * @private
         */
        this._archive = undefined;

        /**
         * @type {App.Parser}
         *
         * @private
         */
        this._parser = new Parser();
    }

    /**
     * Executes the application.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     *
     * @returns {Promise<int>}
     */
    async execute(input, output) {
        const io = new JymfonyStyle(input, output);
        io.title('Tzdata updater');

        const file = await new OpenFile('https://data.iana.org/time-zones/releases/tzdata2021e.tar.gz', 'r');
        const buf = await file.fread(await file.getSize());

        this._archive = new ArchiveReader(buf);

        const files = [
            'africa',
            'antarctica',
            'asia',
            'australasia',
            'etcetera',
            'europe',
            'factory',
            'northamerica',
            'southamerica',
        ];

        io.text('Processing tzdata file...');
        io.progressStart(files.length);
        for (const file of files) {
            this._process(file);
            io.progressAdvance();
        }

        io.progressFinish();

        const baseDir = resolve(__dirname + '/../../data');

        const fs = new Filesystem();
        try {
            await fs.remove(baseDir);
        } catch (e) {
            if (! (e instanceof IOException)) {
                throw e;
            }
        }

        const mkdir = name => {
            try {
                __jymfony.mkdir(name);
            } catch (e) {
                // Do nothing
            }
        };

        mkdir(baseDir + '/timezones');
        mkdir(baseDir + '/abbrev');

        const eslintrc = await new OpenFile(baseDir + '/.eslintrc.json', 'w');
        await eslintrc.fwrite(Buffer.from(`{
  "rules": {
    "no-unused-vars": "off"
  }
}
`));
        await eslintrc.close();

        const linter = new Linter({ cwd: resolve(__dirname + '/..') });

        io.text('Exporting data...');
        io.progressStart(this._parser.zones.length + Object.keys(this._parser.aliases).length + Object.keys(this._parser.abbrevs).length);

        const zones = new Set();
        for (const zone of Object.values(this._parser.zones)) {
            const name = zone.name;
            zones.add(name);

            const utcRules = [];
            for (const rule of zone.rules) {
                if (isString(rule.rule)) {
                    utcRules.push({
                        until: rule.until,
                        ruleSet: this._parser.rules[rule.rule],
                        offset: rule.offset,
                        abbrev: rule.format,
                    });
                } else {
                    utcRules.push(rule);
                }
            }

            mkdir(baseDir + '/timezones/' + dirname(name));

            const zoneFile = await new OpenFile(baseDir + '/timezones/' + name + '.js', 'w');
            const source = 'export default ' + VarExporter.export(utcRules) + ';';
            const o = linter.verifyAndFix(source, linterConfig, {});

            await zoneFile.fwrite(Buffer.from(o.fixed ? o.output : source));
            await zoneFile.close();

            io.progressAdvance();
        }

        for (const [ name, main ] of __jymfony.getEntries(this._parser.aliases)) {
            const aliasFn = baseDir + '/timezones/' + name + '.js';
            const zoneFn = baseDir + '/timezones/' + main + '.js';
            mkdir(dirname(aliasFn));

            const zoneFile = await new OpenFile(aliasFn, 'w');
            const code = 'import tz from "' + relative(dirname(aliasFn), zoneFn) + '";\nexport default tz;';
            const o = linter.verifyAndFix(code, linterConfig, {});

            await zoneFile.fwrite(Buffer.from(o.fixed ? o.output : code));
            await zoneFile.close();

            io.progressAdvance();
        }

        for (const [ name, details ] of __jymfony.getEntries(this._parser.abbrevs)) {
            if (! name) {
                io.progressAdvance();
                continue;
            }

            mkdir(baseDir + '/timezones/' + dirname(name));

            const zoneFile = await new OpenFile(baseDir + '/abbrev/' + name + '.js', 'w');

            const code = 'export default ' + JSON.stringify(details) + ';';
            const o = linter.verifyAndFix(code, linterConfig, {});

            await zoneFile.fwrite(Buffer.from(o.fixed ? o.output : code));
            await zoneFile.close();

            io.progressAdvance();
        }

        const abbrevsJson = await new OpenFile(baseDir + '/abbrevs.json', 'w');
        await abbrevsJson.fwrite(Buffer.from(JSON.stringify(Object.keys(this._parser.abbrevs).filter(v => !!v).sort(), null, 4)));
        await abbrevsJson.close();

        const zonesJson = await new OpenFile(baseDir + '/zones.json', 'w');
        await zonesJson.fwrite(Buffer.from(JSON.stringify([ ...zones.values() ].sort(), null, 4)));
        await zonesJson.close();

        io.progressFinish();

        return 0;
    }

    _process(zone) {
        const file = this._archive.getFile(zone).toString();
        this._parser.parse(file);
    }
}
