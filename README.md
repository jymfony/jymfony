Jymfony
=======
[![Build Status](https://travis-ci.org/jymfony/jymfony.svg?branch=master)](https://travis-ci.org/jymfony/jymfony) [![Build status](https://ci.appveyor.com/api/projects/status/u0pha9iab9dr3kwj/branch/master?svg=true)](https://ci.appveyor.com/project/alekitto/jymfony-354c2/branch/master) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/jymfony/jymfony/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/jymfony/jymfony/?branch=master) [![Code Coverage](https://scrutinizer-ci.com/g/jymfony/jymfony/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/jymfony/jymfony/?branch=master)

Jymfony is a **Node.js framework** for applications and a set of reusable **Javascript components**.
Jymfony was born from an idea of [Alessandro Chitolina](@alekitto) as a port of the popular PHP framework, Symfony.

Requirements
------------
- Node.js >= 6.0.0

Installation
------------
The suggested installation method is via [npm](https://npmjs.com/):

```sh
$ npm install jymfony
```

Components available:
---------------------
As said, Jymfony is made of reusable Javascript components:
- `@jymfony/autoloader`
- `@jymfony/config`
- `@jymfony/console`
- `@jymfony/datetime`
- `@jymfony/dependency-injection`
- `@jymfony/event-dispatcher`
- `@jymfony/filesystem`
- `@jymfony/lexer`
- `@jymfony/logger`
- `@jymfony/property-access`
- `@jymfony/testing`

Each component have its own `README.md`, you can read more about those there.

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

module.exports = getInterface(ThisIsATrait);
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
