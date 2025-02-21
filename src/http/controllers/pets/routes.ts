import { FastifyInstance } from "fastify";
import { create } from "./create";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { details } from "./details";
import { filter } from "./filter";
import { list } from "./list";

export async function petsRoutes(app: FastifyInstance) {
  app.post("/pets", {onRequest: [verifyJWT]}, create);

  app.get('/pets/:id', details)
  app.get('/pets', filter)
  app.get('/pets/all', list)
}
