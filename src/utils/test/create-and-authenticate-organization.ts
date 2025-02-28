import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateOrganization(app: FastifyInstance) {
  await request(app.server).post("/users").send({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "1234567",
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "johndoe@example.com",
    password: "123456",
  });

  const { token } = authResponse.body;

  return {
    token,
  }
}
