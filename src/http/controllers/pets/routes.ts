import { FastifyInstance } from "fastify";
import { create } from "./create";

export async function petsRoutes(app: FastifyInstance) {
  app.post("/pets", create);

}
