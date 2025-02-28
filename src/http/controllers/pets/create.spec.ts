import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateOrganization } from "@/utils/test/create-and-authenticate-organization";
import { PetAge, PetEnergy, PetIndependence, PetSize, PetType } from "@prisma/client";
describe("Create Pet (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to create a pet", async () => {
    const { token } = await createAndAuthenticateOrganization(app);
    const response = await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Douradinho",
             description: "Cachorro muito dócil e amigável.",
             age: PetAge.ADULTO, 
             size: PetSize.GRANDE, 
             energy: PetEnergy.ALTA, 
             independence: PetIndependence.MEDIO,
             type: PetType.CACHORRO,
             organizationId: "org-123",
             photos: [{ url: "https://example.com/photo.jpg" }], 
             requirements: [{ title: "Necessário espaço amplo para brincar" }],
      });
    expect(response.statusCode).toEqual(201);
  });
});
