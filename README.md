<p align="center">
    <img src="https://s3.amazonaws.com/jymfony.com/jymfony-logo.svg" height="150">
</p>

[![Build Status](https://travis-ci.org/jymfony/jymfony.svg?branch=master)](https://travis-ci.org/jymfony/jymfony) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/jymfony/jymfony/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/jymfony/jymfony/?branch=master) [![Code Coverage](https://scrutinizer-ci.com/g/jymfony/jymfony/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/jymfony/jymfony/?branch=master)

Jymfony is a **Node.js framework** for applications and a set of reusable **Javascript components**.
Jymfony was born from an idea of [Alessandro Chitolina](https://github.com/alekitto) as a port of the popular PHP framework, Symfony.

Requirements
------------
- Node.js >= 8.10.0

Installation
------------
The suggested installation method is via [yarn](https://yarnpkg.com/):
```sh
$ yarn add jymfony
```

But you can also install Jymfony via [npm](https://npmjs.com/):
```sh
$ npm install jymfony
```

Basic usage
-----------
You can find a fully working base example project [here](https://github.com/jymfony/example).

Components available:
---------------------
As said, Jymfony is made of reusable Javascript components:
- [@jymfony/autoloader](https://github.com/jymfony/autoloader)
- [@jymfony/cache](https://github.com/jymfony/cache)
- [@jymfony/config](https://github.com/jymfony/config)
- [@jymfony/console](https://github.com/jymfony/console)
- [@jymfony/datetime](https://github.com/jymfony/date-time)
- [@jymfony/debug](https://github.com/jymfony/debug)
- [@jymfony/dependency-injection](https://github.com/jymfony/dependency-injection)
- [@jymfony/dev-server](https://github.com/jymfony/dev-server)
- [@jymfony/event-dispatcher](https://github.com/jymfony/event-dispatcher)
- [@jymfony/filesystem](https://github.com/jymfony/filesystem)
- [@jymfony/http-foundation](https://github.com/jymfony/http-foundation)
- [@jymfony/http-server](https://github.com/jymfony/http-server)
- [@jymfony/kernel](https://github.com/jymfony/kernel)
- [@jymfony/lexer](https://github.com/jymfony/lexer)
- [@jymfony/logger](https://github.com/jymfony/logger)
- [@jymfony/options-resolver](https://github.com/jymfony/options-resolver)
- [@jymfony/property-access](https://github.com/jymfony/property-access)
- [@jymfony/routing](https://github.com/jymfony/routing)
- [@jymfony/security](https://github.com/jymfony/security)
- [@jymfony/templating](https://github.com/jymfony/templating)
- [@jymfony/testing](https://github.com/jymfony/testing)

Each component has its own `README.md`, you can read more about those there.

Also, it comes with some `DataStructures`. With Jymfony you can declare:
- interfaces
```js
class ThisIsAnInterface {
    // ...
}

module.exports = getInterface(ThisIsAnInterface);
```
- traits
```js
class ThisIsATrait {
    // ...
}

module.exports = getTrait(ThisIsATrait);
```

Testing
-------
In order to test Jymfony, just run:

```sh
$ yarn test
```

Contributing
------------
Contributions are welcome. Feel free to open a PR or file an issue here on GitHub!

License
-------
Jymfony is licensed under the MIT License - see the [LICENSE](https://github.com/jymfony/jymfony/blob/master/LICENSE) file for details

About Us
--------
The Jymfony team:
- Alessandro Chitolina [@alekitto](https://github.com/alekitto) (project leader)
- Massimiliano Braglia [@massimilianobraglia](https://github.com/massimilianobraglia) (contributor)
- Giovanni Albero [@giovannialbero1992](https://github.com/giovannialbero1992) (contributor)
- Stefano Rainieri [@stefano-rainieri](https://github.com/stefano-rainieri) (contributor)

The logo is an artwork made by Daniele Tognetti
