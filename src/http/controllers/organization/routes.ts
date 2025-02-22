import { FastifyInstance } from "fastify";
import { create } from "./create";
import { authenticate } from "./authenticate";

export async function organizationRoutes(app: FastifyInstance) {
  app.post("/organization", create);

  app.post('/sessions', authenticate)
}
