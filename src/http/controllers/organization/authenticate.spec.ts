import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate", async () => {
    await request(app.server).post("/organization").send({
        name: "Canil Bacco",
        email: "canilbacco@gmail.com",
        passwordHash: "1234567",
        address: "Rua Coronel de Almeida",
        city: "Itu",
        state: "SP",
        postalCode: "53938901282309",
        phone: "1199993293292",
    });

    const response = await request(app.server).post("/sessions").send({
        email: "canilbacco@gmail.com",
        passwordHash: "1234567",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
        token: expect.any(String),
    })
  });
});
