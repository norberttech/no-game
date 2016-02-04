import Assert from '../../src/JSAssert/Assert';

describe("Assert", () => {
    it("compares instance of", () => {
        Assert.instanceOf(new String("string"), String);
    });

    it ("throws error when asserting instance of non object", () => {
        expect(() => {Assert.instanceOf(1, String)}).toThrow('Expected object but got 1');
        expect(() => {Assert.instanceOf(new Number(2), String)}).toThrow('Expected instance of String, got Number');
    });

    it ("throws error when compared different instances", () => {
        expect(() => {Assert.instanceOf(new Number(2), String)}).toThrow('Expected instance of String, got Number');
    });

    it ("asserts integers", () => {
        Assert.integer(125);
    });

    it ("throws error when asserting non integer as an interger", () => {
        expect(() => {Assert.integer("string")}).toThrow('Expected integer value, got string');
        expect(() => {Assert.integer(new Array([]))}).toThrow('Expected integer value, got object');
        expect(() => {Assert.integer(1.23)}).toThrow('Expected integer value, got 1.23');
        expect(() => {Assert.integer(true)}).toThrow('Expected integer value, got true');
        expect(() => {Assert.integer(() => {})}).toThrow('Expected integer value, got function');
    });

    it ("asserts strings", () => {
        Assert.string("string");
        Assert.string("");
    });

    it ("throws error when asserting non string as an string", () => {
        expect(() => {Assert.string(123)}).toThrow('Expected string value, got 123');
        expect(() => {Assert.string(new Array([]))}).toThrow('Expected string value, got object');
        expect(() => {Assert.string(1.23)}).toThrow('Expected string value, got 1.23');
        expect(() => {Assert.string(true)}).toThrow('Expected string value, got true');
        expect(() => {Assert.string(() => {})}).toThrow('Expected string value, got function');
    });

    it ("asserts boolean", () => {
        Assert.boolean(true);
        Assert.boolean(false);
    });

    it ("throws error when asserting non boolean as an boolean", () => {
        expect(() => {Assert.boolean(123)}).toThrow('Expected boolean value, got 123');
        expect(() => {Assert.boolean(new Array([]))}).toThrow('Expected boolean value, got object');
        expect(() => {Assert.boolean(1.23)}).toThrow('Expected boolean value, got 1.23');
        expect(() => {Assert.boolean(() => {})}).toThrow('Expected boolean value, got function');
    });

    it ("asserts values greater than", () => {
        Assert.greaterThan(10, 120);
    });

    it ("throws error when asserting value lower than", () => {
        expect(() => {Assert.greaterThan(10, 1)}).toThrow('Expected value 1 to be greater than 10');
    });

    it ("asserts array", () => {
        Assert.array(new Array(5));
        Assert.array(['test1', 'test2']);

    });

    it ("throws error when asserting non array value as array", () => {
        expect(() => {Assert.array(123)}).toThrow('Expected array value, got 123');
    });

    it ("asserts contains only specific instances in array", () => {
        Assert.containsOnly(
            [
                new String("test"),
                new String("test1")
            ],
            String
        );
    });

    it ("throws error when contains only does not assert on array", () => {
        expect(() => {Assert.containsOnly(123)}).toThrow('Expected array value, got 123');
    });

    it ("throws error when contains only has at least one non object element", () => {
        expect(() => {Assert.containsOnly([new String("test"), 132], String)}).toThrow('Expected instance of String, got 132');
    });

    it ("throws error when contains only has at least one non expected instance element", () => {
        expect(() => {Assert.containsOnly([new String("test"), new Number(23)], String)}).toThrow('Expected instance of String, got Number');
    });

    it ("asserts array count", () => {
        Assert.count(
            2,
            [
                new String("test"),
                new String("test1")
            ]
        );
    });

    it ("throws error when expected count different than array count", () => {
        expect(() => {Assert.count(3, [new String("test")])}).toThrow('Expected count 3, got 1');
    });

    it ("asserts not empty value", () => {
        Assert.notEmpty("test");
    });

    it ("throws error when asserting empty string as non empty value", () => {
        expect(() => {Assert.notEmpty("")}).toThrow('Expected not empty value');
    });
});
