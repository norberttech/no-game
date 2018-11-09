import LoginMessage from './../../../../src/NoGame/Client/Network/LoginMessage';
import MoveMessage from './../../../../src/NoGame/Client/Network/MoveMessage';
import SayMessage from './../../../../src/NoGame/Client/Network/SayMessage';
import Assert from "assert-js";

describe("Messages", () => {
    it("allows to stringify login message", () => {
        let message = new LoginMessage("norbert", "password");

        Assert.equal(message.toString(), '{"index":0,"name":"login","data":{"login":"norbert","password":"password"}}');
    });

    it("allows to stringify move message", () => {
        let message = new MoveMessage(10, 10);

        Assert.equal(message.toString(), '{"index":0,"name":"move","data":{"x":10,"y":10}}');
    });

    it("allows to stringify say message", () => {
        let message = new SayMessage("Test Message");

        Assert.equal(message.toString(), '{"index":0,"name":"message","data":{"message":"Test Message"}}');
    });
});