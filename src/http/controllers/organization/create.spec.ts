import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateOrganization } from "@/utils/test/create-and-authenticate-organization";
describe("Create Organization (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to create a organization", async () => {
    const { token } = await createAndAuthenticateOrganization(app);
    const response = await request(app.server)
      .post("/organization")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Canil Bacco",
        email: "canilbacco@gmail.com",
        passwordHash: "1234567",
        address: "Rua Coronel de Almeida",
        city: "Itu",
        state: "SP",
        postalCode: "53938901282309",
        phone: "1199993293292",
      });
    expect(response.statusCode).toEqual(201);
  });
});
