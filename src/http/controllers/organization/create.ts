import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateOrganizationUseCase } from "@/services/factories/make-create-organization-use-case";


export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    passwordHash: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode:z.string(),
    phone:z.string(),
  });

  const {
    name,
    email,
    passwordHash,
    address,
    city,
    state,
    postalCode,
    phone,
  } = createBodySchema.parse(request.body);

  try {
    const createUseCase = makeCreateOrganizationUseCase();

    await createUseCase.execute({
        name,
        email,
        passwordHash,
        address,
        city,
        state,
        postalCode,
        phone,
    });
  } catch (error) {
    if (error) {
      return reply
        .status(409)
        .send({
          message: "An unexpected error occurred while creating the organization.",
        });
    }

    throw error;
  }

  return reply.status(201).send();
}
