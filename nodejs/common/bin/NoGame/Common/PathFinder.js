'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assert = require('assert-js');
var PF = require('pathfinding');
var PathFinderGrid = require('./PathFinderGrid');

var PathFinder = function () {
    function PathFinder() {
        _classCallCheck(this, PathFinder);

        this._finder = new PF.AStarFinder({
            allowDiagonal: false,
            diagonalMovement: false
        });
    }

    /**
     * @param {int} fromX
     * @param {int} fromY
     * @param {int} toX
     * @param {int} toY
     * @param {PathFinderGrid} grid
     *
     * @returns {Array}
     */


    _createClass(PathFinder, [{
        key: 'findPath',
        value: function findPath(fromX, fromY, toX, toY, grid) {
            Assert.integer(fromX);
            Assert.integer(fromY);
            Assert.integer(toX);
            Assert.integer(toY);
            Assert.instanceOf(grid, PathFinderGrid);

            var pfGrid = new PF.Grid(grid.getSizeX(), grid.getSizeY());
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = grid.getTiles()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var position = _step.value;

                    pfGrid.setWalkableAt(position.x, position.y, position.walkable);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var path = this._finder.findPath(fromX, fromY, toX, toY, pfGrid);

            if (!path.length) {
                throw 'Can\'t go from ' + fromX + ':' + fromY + ' to ' + toX + ':' + toY + '.';
            }

            return path.map(function (position) {
                return {
                    x: position[0],
                    y: position[1]
                };
            });
        }
    }]);

    return PathFinder;
}();

module.exports = PathFinder;