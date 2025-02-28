import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateOrganization } from "@/utils/test/create-and-authenticate-organization";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

describe("List available pets (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list available pets", async () => {
    const { token } = await createAndAuthenticateOrganization(app);

    // Criar uma nova organização no banco de dados
    const organization = await prisma.organization.create({
      data: {
        name: "Canil Bacco",
        email: "canilbacco@gmail.com",
        passwordHash: "1234567",
        address: "Rua Coronel de Almeida",
        city: "Itu",
        state: "SP",
        postalCode: "53938901282309",
        phone: "1199993293292",
      },
    });

    // Criar pets associados à organização
    await prisma.pet.createMany({
      data: [
        {
          id: crypto.randomUUID(), // ID único
          name: "Rex",
          description: "Um cachorro amigável",
          age: "FILHOTE",
          size: "MEDIO",
          energy: "ALTA",
          independence: "MEDIO",
          type: "CACHORRO",
          photos: [],
          requirements: [],
          organizationId: organization.id,
        },
        {
          id: crypto.randomUUID(), // Outro ID único
          name: "Mia",
          description: "Uma gata calma",
          age: "ADULTO",
          size: "PEQUENO",
          energy: "BAIXA",
          independence: "ALTO",
          type: "GATO",
          photos: [],
          requirements: [],
          organizationId: organization.id,
        },
      ],
    });

    // Fazer requisição para listar pets
    const response = await request(app.server)
      .get("/pets/all")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toEqual([
      expect.objectContaining({
        organizationId: organization.id,
      }),
      expect.objectContaining({
        organizationId: organization.id,
      }),
    ]);
  });
});
