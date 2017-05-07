'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assert = require('assert-js');
var AreaRange = require('./AreaRange');

var AreaCalculator = function () {
    function AreaCalculator() {
        _classCallCheck(this, AreaCalculator);
    }

    _createClass(AreaCalculator, null, [{
        key: 'visibleTilesRange',

        /**
         * @param {int} centerX
         * @param {int} centerY
         * @param {int} tilesX
         * @param {int} tilesY
         * @returns {AreaRange}
         */
        value: function visibleTilesRange(centerX, centerY, tilesX, tilesY) {
            Assert.integer(centerX);
            Assert.integer(centerY);
            Assert.oddNumber(tilesX);
            Assert.oddNumber(tilesY);

            return new AreaRange(centerX - (tilesX - 1) / 2, centerX - Math.round(tilesX / 2) + tilesX, centerY - (tilesY - 1) / 2, centerY - Math.round(tilesY / 2) + tilesY);
        }

        /**
         * Remember that tiles starts from zero. 15 - 1 = 14; 14 / 2 = 7.
         * So center tile will be eight tile from zero tile.
         *
         * @param {int} tilesX
         * @param {int} tilesY
         * @returns {{x: int, y: int}}
         */

    }, {
        key: 'centerPosition',
        value: function centerPosition(tilesX, tilesY) {
            Assert.oddNumber(tilesX);
            Assert.oddNumber(tilesY);

            return {
                x: (tilesX - 1) / 2,
                y: (tilesY - 1) / 2
            };
        }
    }]);

    return AreaCalculator;
}();

module.exports = AreaCalculator;