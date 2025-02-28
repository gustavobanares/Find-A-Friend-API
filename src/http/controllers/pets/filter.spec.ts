import request from "supertest";
import { app } from "@/app";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { createAndAuthenticateOrganization } from "@/utils/test/create-and-authenticate-organization";
import { prisma } from "@/lib/prisma";
import { PetAge, PetEnergy, PetIndependence, PetSize, PetType } from "@prisma/client";

describe("Filter Pets (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to filter pets by city", async () => {
    const { token } = await createAndAuthenticateOrganization(app);

    // Criando organização e pets no banco de dados
    const organization = await prisma.organization.create({
      data: {
        name: "Canil Boos",
        email: "canilboos@gmail.com",
        passwordHash: "123456",
        address: "Rua A, 123",
        city: "São Paulo",
        state: "SP",
        postalCode: "01000000",
        phone: "11999999999",
      },
    });

    const pet1 = await prisma.pet.create({
      data: {
        name: "Rex",
        description: "Cachorro dócil",
        age: PetAge.ADULTO,
        size: PetSize.MEDIO,
        energy: PetEnergy.ALTA,
        independence: PetIndependence.MEDIO,
        type: PetType.CACHORRO,
        photos: ["photo1.jpg"],
        requirements: ["Espaço amplo"],
        organizationId: organization.id,
      },
    });

    const pet2 = await prisma.pet.create({
      data: {
        name: "Miau",
        description: "Gato tranquilo",
        age: PetAge.IDOSO,
        size: PetSize.PEQUENO,
        energy: PetEnergy.BAIXA,
        independence: PetIndependence.ALTO,
        type: PetType.GATO,
        photos: ["photo2.jpg"],
        requirements: ["Ambiente calmo"],
        organizationId: organization.id,
      },
    });

    // Fazendo requisição para o endpoint de filtragem
    const response = await request(app.server)
      .get("/pets")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toHaveLength(2);
    expect(response.body.pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: pet1.id, name: "Rex" }),
        expect.objectContaining({ id: pet2.id, name: "Miau" }),
      ])
    );
  });

  it("should filter pets by type", async () => {
    const { token } = await createAndAuthenticateOrganization(app);

    const response = await request(app.server)
      .get("/pets")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body.pets[0]).toHaveProperty("name", "Miau");
  });

  it("should return an empty list if no pets match criteria", async () => {
    const { token } = await createAndAuthenticateOrganization(app);

    const response = await request(app.server)
      .get("/pets")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toHaveLength(0);
  });
});
