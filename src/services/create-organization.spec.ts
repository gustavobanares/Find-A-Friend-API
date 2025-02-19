import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrganizationRepository } from "@/repositories/in-memory/in-memory-organization-repository";
import { CreateOrganizationUseCase } from "./create-organization";

let organizationRepository: InMemoryOrganizationRepository;
let sut: CreateOrganizationUseCase;

describe("Create A Organization Use Case", () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository();
    sut = new CreateOrganizationUseCase(organizationRepository);
  });

  it("should be able to create a organization", async () => {
    const { organization } = await sut.execute({
      name: "Canil Bacco",
      email: "canilbacco@gmail.com",
      passwordHash: "1234567",
      address: "Rua Coronel de Almeida",
      city: "Itu",
      state: "SP",
      postalCode: "53938901282309",
      phone: "1199993293292",
    });

    expect(organization.id).toEqual(expect.any(String));
  });
});
