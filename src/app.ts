import fastify from "fastify";
import { petsRoutes } from "./http/controllers/pets/routes";
import { organizationRoutes } from "./http/controllers/organization/routes";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

const jwtSecret = env.JWT_SECRET

app.register(fastifyJwt, {
  secret: jwtSecret,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyCookie)

app.register(petsRoutes);
app.register(organizationRoutes);

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
      return reply
        .status(400)
        .send({ message: "Validation error.", issues: error.format() });
    }
  
    if (env.NODE_ENV !== "production") {
      console.error(error);
    } else {
    }
  
    return reply.status(500).send({ message: "Internal server error" });
  });

