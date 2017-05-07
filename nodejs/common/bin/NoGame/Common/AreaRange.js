'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assert = require('assert-js');

var AreaRange = function () {
    /**
     * @param {int} startX
     * @param {int} endX
     * @param {int} startY
     * @param {int} endY
     */
    function AreaRange(startX, endX, startY, endY) {
        _classCallCheck(this, AreaRange);

        Assert.integer(startX);
        Assert.integer(endX);
        Assert.integer(startY);
        Assert.integer(endY);

        this._startX = startX;
        this._endX = endX;
        this._startY = startY;
        this._endY = endY;
    }

    /**
     * @returns {int}
     */


    _createClass(AreaRange, [{
        key: 'startX',
        get: function get() {
            return this._startX;
        }

        /**
         * @returns {int}
         */

    }, {
        key: 'endX',
        get: function get() {
            return this._endX;
        }

        /**
         * @returns {int}
         */

    }, {
        key: 'startY',
        get: function get() {
            return this._startY;
        }

        /**
         * @returns {int}
         */

    }, {
        key: 'endY',
        get: function get() {
            return this._endY;
        }
    }]);

    return AreaRange;
}();

module.exports = AreaRange;