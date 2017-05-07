'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assert = require('assert-js');

var NetworkMessage = function () {
    function NetworkMessage() {
        _classCallCheck(this, NetworkMessage);

        this._name = null;
        this._data = {};
        this._index = 0;
    }

    /**
     * @returns {object}
     */


    _createClass(NetworkMessage, [{
        key: 'setIndex',


        /**
         * @param {int} index
         */
        value: function setIndex(index) {
            Assert.integer(index);

            this._index = index;
        }

        /**
         * @return {string}
         */

    }, {
        key: 'toString',
        value: function toString() {
            return JSON.stringify({ index: this._index, name: this._name, data: this._data });
        }
    }, {
        key: 'data',
        get: function get() {
            return this._data;
        }

        /**
         * @returns {string|null}
         */

    }, {
        key: 'name',
        get: function get() {
            return this._name;
        }
    }]);

    return NetworkMessage;
}();

module.exports = NetworkMessage;