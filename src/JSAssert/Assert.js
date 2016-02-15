'use strict';

import Message from './Message';

export default class Assert
{
    /**
     * @param objectValue
     * @param instance
     */
    static instanceOf(objectValue, instance)
    {
        if (typeof objectValue !== 'object') {
            throw Message.expected("object", objectValue);
        }

        if (!(objectValue instanceof instance)) {
            throw Message.expectedInstanceOf(instance.name, objectValue);
        }
    }

    /**
     * @param integerValue
     */
    static integer(integerValue)
    {
        if (!Number.isInteger(integerValue)) {
            throw Message.expected("integer", integerValue);
        }
    }

    /**
     * @param stringValue
     */
    static string(stringValue)
    {
        if (typeof stringValue !== "string") {
            throw Message.expected("string", stringValue);
        }
    }

    /**
     * @param booleanValue
     */
    static boolean(booleanValue)
    {
        if (typeof booleanValue !== 'boolean') {
            throw Message.expected("boolean", booleanValue);
        }
    }

    /**
     * @param objectValue
     */
    static object(objectValue)
    {
        if (typeof objectValue !== 'object') {
            throw Message.expected("object", objectValue);
        }
    }

    /**
     * @param arrayValue
     */
    static array(arrayValue)
    {
        if (!Array.isArray(arrayValue)) {
            throw Message.expected("array", arrayValue);
        }
    }

    /**
     * @param functionValue
     */
    static isFunction(functionValue)
    {
        if (typeof functionValue !== 'function') {
            throw Message.expected("function", functionValue);
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
                throw Message.expectedInstanceOf(expectedInstance.name, element);
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
            throw Message.expected("not empty value", value);
        }
    }


    /**
     * @param integerValue
     */
    static oddNumber(integerValue)
    {
        this.integer(integerValue);

        if ((integerValue % 2) !== 1) {
            throw Message.expected("odd number", integerValue);
        }
    }
}