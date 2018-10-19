(function() {
    'use strict';

    /**
     * Require the given path.
     *
     * @param {String} path
     * @return {Object} exports
     * @api public
     */

    function require(path) {
        var resolved = require.resolve(path);

        // lookup failed
        if (null == resolved) {
            throw new Error('Failed to require');
            return
        }

        var module = require.modules[resolved];

        // perform real require()
        // by invoking the module's
        // registered function
        // if (!module._resolving && !module.exports) {
        //     var mod = {};
        //     mod.exports = {};
        //     mod.client = mod.component = true;
        //     module._resolving = true;
        //     module.call(this, mod.exports, require.relative(resolved), mod);
        //     delete module._resolving;
        //     module.exports = mod.exports;
        // }
        var mod = {};
        mod.exports = {};
        module.call(this, mod.exports, null, mod);
        module.exports = mod.exports.myExports;
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

    require.register("browser/debug.js", function(module, exports, require) {
        //why need a new property?
        module.myExports = {
            test: function() {
                console.log("test function run");
            }
        }

    }); // module: browser/debug.js

    require.register("browser/fs.js", function(module, exports, require) {

    }); // module: browser/fs.js

    require.register("browser/path.js", function(module, exports, require) {

    }); // module: browser/path.js

    var myDebug = require("browser/debug");
    myDebug.test();
})(); //run immedately