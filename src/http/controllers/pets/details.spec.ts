import request from "supertest";
import { app } from "@/app";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { createAndAuthenticateOrganization } from "@/utils/test/create-and-authenticate-organization";
import { prisma } from "@/lib/prisma";
import { PetAge, PetEnergy, PetIndependence, PetSize, PetType } from "@prisma/client";

describe("Get Pet Details (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get pet details", async () => {
    const { token } = await createAndAuthenticateOrganization(app);

    // Criando uma organização e um pet no banco
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

    const pet = await prisma.pet.create({
      data: {
        name: "Douradinho",
        description: "Cachorro muito dócil e amigável.",
        age: PetAge.ADULTO,
        size: PetSize.GRANDE,
        energy: PetEnergy.ALTA,
        independence: PetIndependence.MEDIO,
        type: PetType.CACHORRO,
        photos: ["https://example.com/photo.jpg"],
        requirements: ["Necessário espaço amplo para brincar"],
        organizationId: organization.id,
      },
    });

    // Fazendo requisição para obter detalhes do pet
    const response = await request(app.server)
      .get(`/pets/:id`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        id: pet.id,
        name: "Douradinho",
        description: "Cachorro muito dócil e amigável.",
        age: PetAge.ADULTO,
        size: PetSize.GRANDE,
        energy: PetEnergy.ALTA,
        independence: PetIndependence.MEDIO,
        type: PetType.CACHORRO,
        photos: ["https://example.com/photo.jpg"],
        requirements: ["Necessário espaço amplo para brincar"],
      })
    );
  });

  it("should return 404 if pet does not exist", async () => {
    const { token } = await createAndAuthenticateOrganization(app);

    const response = await request(app.server)
      .get("/pets/:id")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(404);
    expect(response.body).toHaveProperty("message", "Pet not found");
  });
});
