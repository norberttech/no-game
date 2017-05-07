'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assert = require('assert-js');

var PathFinderGrid = function () {
    /**
     * @param {int} sizeX
     * @param {int} sizeY
     */
    function PathFinderGrid(sizeX, sizeY) {
        _classCallCheck(this, PathFinderGrid);

        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._tiles = [];
    }

    /**
     * @returns {int}
     */


    _createClass(PathFinderGrid, [{
        key: 'getSizeX',
        value: function getSizeX() {
            return this._sizeX;
        }

        /**
         * @returns {int}
         */

    }, {
        key: 'getSizeY',
        value: function getSizeY() {
            return this._sizeY;
        }

        /**
         * @param {int} x
         * @param {int} y
         * @param {boolean} walkable
         */

    }, {
        key: 'addTile',
        value: function addTile(x, y, walkable) {
            Assert.integer(x);
            Assert.integer(y);
            Assert.boolean(walkable);

            this._tiles.push({
                x: x,
                y: y,
                walkable: walkable
            });
        }

        /**
         * @returns {Array}
         */

    }, {
        key: 'getTiles',
        value: function getTiles() {
            return this._tiles;
        }
    }]);

    return PathFinderGrid;
}();

module.exports = PathFinderGrid;