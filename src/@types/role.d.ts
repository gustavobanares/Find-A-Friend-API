import "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    organizations: {
      role: string;
    };
  }
}
