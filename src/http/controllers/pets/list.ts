import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeListAvailablePetsUseCase } from "@/services/factories/make-list-available-pets-use-case";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listAvailableUseCase = makeListAvailablePetsUseCase();

  const querySchema = z.object({
    city: z.string().min(1, "City is required"),
    page: z.coerce.number().min(1).default(1)
  });

  const {city, page} = querySchema.parse(request.query);

  const { pets, totalPages} = await listAvailableUseCase.execute({city, page});

  return reply.status(200).send({ pets, totalPages });
}
