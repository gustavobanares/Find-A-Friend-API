import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { InMemoryOrganizationRepository } from "@/repositories/in-memory/in-memory-organization-repository";

let organizationRepository: InMemoryOrganizationRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository();
    sut = new AuthenticateUseCase(organizationRepository);
  });   

  it("should be able to authenticate", async () => {
    await organizationRepository.createMinimal({
      name: "John Doe",
      email: "johndoe@example.com",
      passwordHash: await hash("123456", 6),
    });

    const { organization } = await sut.execute({
      email: "johndoe@example.com",
      passwordHash: "123456",
    });

    expect(organization.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        passwordHash: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await organizationRepository.createMinimal({
      name: "John Doe",
      email: "johndoe@example.com",
      passwordHash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        passwordHash: "123123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
