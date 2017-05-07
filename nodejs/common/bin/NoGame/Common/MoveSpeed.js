'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assert = require('assert-js');

/**
 * @type {number}
 */
var BASE_MOVE_TIME = 500;

var MoveSpeed = function () {
  function MoveSpeed() {
    _classCallCheck(this, MoveSpeed);
  }

  _createClass(MoveSpeed, null, [{
    key: 'calculateMoveTime',

    /**
     * @param {number} distance
     * @param {int} [moveSpeedModifier]
     * @returns {number}
     */
    value: function calculateMoveTime(distance) {
      var moveSpeedModifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      Assert.number(distance);
      Assert.integer(moveSpeedModifier);

      return (distance * BASE_MOVE_TIME * 100 - moveSpeedModifier) / 100;
    }
  }]);

  return MoveSpeed;
}();

module.exports = MoveSpeed;