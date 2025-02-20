import fastify from "fastify";
import { petsRoutes } from "./http/controllers/pets/routes";
import { organizationRoutes } from "./http/controllers/organization/routes";

export const app = fastify()


app.register(petsRoutes)
app.register(organizationRoutes)
