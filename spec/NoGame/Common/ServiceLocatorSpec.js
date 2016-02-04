import ServiceLocator from '../../../src/NoGame/Common/ServiceLocator';
import ContainerBuilder from '../../../src/NoGame/Common/ContainerBuilder';


class CustomContainer extends ContainerBuilder
{
    build()
    {
        let container = new Map();
        container.set('service.stub', new String("string service instance"));

        return container;
    }
}

describe("Service Locator", () => {
    it("build container using Container Builder", () => {
        let locator = new ServiceLocator(new CustomContainer());

       expect(locator.get('service.stub')).toEqual(new String("string service instance"));
    });

    it("throws error when service does not exists", () => {
        let locator = new ServiceLocator(new CustomContainer());

        expect(() => {locator.get('not_existing.service');})
            .toThrow(`Service with id "not_existing.service" does not exists`);
    });
});