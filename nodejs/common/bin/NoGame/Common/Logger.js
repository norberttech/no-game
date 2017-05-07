'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {
    function Logger() {
        _classCallCheck(this, Logger);
    }

    _createClass(Logger, [{
        key: 'fatal',
        value: function fatal(entry) {
            throw new Error('Not implemented');
        }
    }, {
        key: 'error',
        value: function error(entry) {
            throw new Error('Not implemented');
        }
    }, {
        key: 'warn',
        value: function warn(entry) {
            throw new Error('Not implemented');
        }
    }, {
        key: 'info',
        value: function info(entry) {
            throw new Error('Not implemented');
        }
    }, {
        key: 'debug',
        value: function debug(entry) {
            throw new Error('Not implemented');
        }
    }, {
        key: 'trace',
        value: function trace(entry) {
            throw new Error('Not implemented');
        }
    }]);

    return Logger;
}();

module.exports = Logger;