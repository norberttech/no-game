'use strict';

export default class Assert
{
    /**
     * @param objectValue
     * @param instance
     */
    static instanceOf(objectValue, instance)
    {
        if (typeof objectValue !== 'object') {
            throw `Expected object but got ${objectValue}`;
        }

        if (!(objectValue instanceof instance)) {
            throw `Expected instance of ${instance.name}, got ${objectValue.constructor.name}`;
        }
    }

    /**
     * @param integerValue
     */
    static integer(integerValue)
    {
        if (!Number.isInteger(integerValue)) {
            if (typeof integerValue === 'object') {
                throw `Expected integer value, got object`;
            }
            if (typeof integerValue === 'function') {
                throw `Expected integer value, got function`;
            }

            throw `Expected integer value, got ${integerValue}`;
        }
    }

    /**
     * @param stringValue
     */
    static string(stringValue)
    {
        if (typeof stringValue !== "string") {
            if (typeof stringValue === 'object') {
                throw `Expected string value, got object`;
            }
            if (typeof stringValue === 'function') {
                throw `Expected string value, got function`;
            }

            throw `Expected string value, got ${stringValue}`;
        }
    }

    /**
     * @param booleanValue
     */
    static boolean(booleanValue)
    {
        if (typeof booleanValue !== 'boolean') {
            if (typeof booleanValue === 'object') {
                throw `Expected boolean value, got object`;
            }
            if (typeof booleanValue === 'function') {
                throw `Expected boolean value, got function`;
            }

            throw `Expected boolean value, got ${booleanValue}`;
        }
    }

    /**
     * @param objectValue
     */
    static object(objectValue)
    {
        if (typeof objectValue !== 'object') {
            if (typeof objectValue === 'function') {
                throw `Expected object value, got function`;
            }

            if (typeof objectValue === 'array') {
                throw `Expected object value, got array`;
            }

            throw `Expected object value, got ${objectValue}`;
        }
    }

    /**
     * @param arrayValue
     */
    static array(arrayValue)
    {
        if (!Array.isArray(arrayValue)) {
            if (typeof arrayValue === 'object') {
                throw `Expected array value, got object`;
            }
            if (typeof arrayValue === 'function') {
                throw `Expected array value, got function`;
            }

            throw `Expected array value, got ${arrayValue}`;
        }
    }

    /**
     * @param functionValue
     */
    static isFunction(functionValue)
    {
        if (typeof functionValue !== 'function') {
            if (typeof functionValue === 'object') {
                throw `Expected function value, got object`;
            }

            throw `Expected function value, got ${functionValue}`;
        }
    }

    /**
     * @param {int} requiredTreshold
     * @param {int} integerValue
     */
    static greaterThan(requiredTreshold, integerValue)
    {
        Assert.integer(requiredTreshold);
        Assert.integer(integerValue);

        if (integerValue <= requiredTreshold) {
            throw `Expected value ${integerValue} to be greater than ${requiredTreshold}`;
        }
    }

    /**
     * @param {array} arrayValue
     * @param {function} expectedInstance
     */
    static containsOnly(arrayValue, expectedInstance)
    {
        this.array(arrayValue);

        for (let element of arrayValue) {
            try {
                this.instanceOf(element, expectedInstance);
            } catch (error) {
                if (typeof element !== 'object') {
                    throw `Expected instance of ${expectedInstance.name}, got ${element}`;
                }

                throw `Expected instance of ${expectedInstance.name}, got ${element.constructor.name}`;
            }
        }
    }

    /**
     * @param {int} expectedCount
     * @param {array} arrayValue
     */
    static count(expectedCount, arrayValue)
    {
        this.integer(expectedCount);
        this.array(arrayValue);

        if (arrayValue.length !== expectedCount) {
            throw `Expected count ${expectedCount}, got ${arrayValue.length}`;
        }
    }

    /**
     * @param value
     */
    static notEmpty(value)
    {
        if (value.length === 0) {
            throw `Expected not empty value`;
        }
    }
}