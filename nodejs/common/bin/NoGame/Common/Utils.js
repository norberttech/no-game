'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'randomRange',

        /**
         * @param {int} minimum
         * @param {int} maximum
         * @returns {int}
         */
        value: function randomRange(minimum, maximum) {
            return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        }

        /**
         * @param {int} number
         * @returns {number}
         */

    }, {
        key: 'randomSign',
        value: function randomSign(number) {
            var sign = Utils.randomRange(0, 1);

            return sign === 0 ? number : -number;
        }
    }]);

    return Utils;
}();

module.exports = Utils;