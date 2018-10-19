(function() {
    'use strict';

    /**
     * Require the given path.
     *
     * @param {String} path
     * @return {Object} exports
     * @api public
     */

    function require(p) {
        var path = require.resolve(p);
        //register时候 已经在modules里添加了 N个模块 a.js/b.js/c.js
        var module = require.modules[path];
        // lookup failed
        if (!module) {
            throw new Error('failed to require ' + path);
        }

        if (!module.exports) {
            // perform real require()
            // by invoking the module's
            // registered function
            var mod = {};
            module.call(this, mod, null, require.relative(path));
            module.exports = mod.exports;
        }

        return module.exports;
    }

    /**
     * Registered modules.
     */

    require.modules = {};

    require.resolve = function(path) {
        var orig = path,
            reg = path + '.js',
            index = path + '/index.js';
        return require.modules[reg] && reg ||
            require.modules[index] && index ||
            orig;
    };

    require.register = function(path, fn) {
        require.modules[path] = fn;
    };

    require.relative = function(parent) {
        return function(p) {
            if ('.' != p.charAt(0)) return require(p);

            var path = parent.split('/'),
                segs = p.split('/');
            path.pop();

            for (var i = 0; i < segs.length; i++) {
                var seg = segs[i];
                if ('..' == seg) path.pop();
                else if ('.' != seg) path.push(seg);
            }

            return require(path.join('/'));
        };
    };

    require.register("a.js", function(module, exports, require) {
        //采用 CommonJS 模块规范
        module.exports = {
            message: "hello world",
            test: function() {
                var b = require("b");
                var c = require("c");
                console.log('message inside : ' + this.message);
                console.log('b : ' + b.SimpleMessage);
                console.log('c : ' + c.NewMessage);
            }
        }

    }); // module: a.js

    require.register("b.js", function(module, exports, require) {
        module.exports = {
            SimpleMessage: 'simple world'
        }
    }); // module: b.js

    require.register("c.js", function(module, exports, require) {
        module.exports = {
            NewMessage: 'new world'
        }
    }); // module: c.js

    var a = require("a");
    a.test();


})(); //run immedately