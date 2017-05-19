'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Assert = require('assert-js');

var ExperienceCalculator = function () {
    function ExperienceCalculator() {
        _classCallCheck(this, ExperienceCalculator);
    }

    _createClass(ExperienceCalculator, null, [{
        key: 'requiredExp',

        /**
         * @param {int} level
         * @returns {int}
         */
        value: function requiredExp(level) {
            Assert.integer(level);

            if (level < 1) {
                return 0;
            }

            return (50 * Math.pow(level - 1, 3) - 150 * Math.pow(level - 1, 2) + 400 * (level - 1)) / 3;
        }

        /**
         * @param {int} exp
         * @returns {int}
         */

    }, {
        key: 'level',
        value: function level(exp) {
            Assert.integer(exp);

            var lvl = 1;

            while (true) {
                var requiredExp = this.requiredExp(lvl);

                if (requiredExp > exp) {
                    return lvl - 1;
                }

                lvl++;
            }
        }

        /**
         * @param {int} exp
         * @param {float} modifier
         * @returns {number}
         */

    }, {
        key: 'loss',
        value: function loss(exp) {
            var modifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;

            Assert.integer(exp);
            Assert.number(modifier);

            var currentLevel = this.level(exp);
            var currentLevelExp = this.requiredExp(currentLevel);
            var previousLevelExp = this.requiredExp(currentLevel - 1);

            var expDifference = currentLevelExp - previousLevelExp;

            var baseLoss = 1.55;
            var loss = baseLoss - modifier <= 0 ? 0 : baseLoss - modifier;

            return Math.ceil(expDifference * loss);
        }
    }]);

    return ExperienceCalculator;
}();

module.exports = ExperienceCalculator;