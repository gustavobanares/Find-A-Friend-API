import "@fastify/jwt";

declare module "fastify/jwt" {
  export interface fastifyJWT {
    organization: {
      sub: string;
    };
  }
}
