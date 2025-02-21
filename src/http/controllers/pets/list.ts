import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeListAvailablePetsUseCase } from "@/services/factories/make-list-available-pets-use-case";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listAvailableUseCase = makeListAvailablePetsUseCase();

  const querySchema = z.object({
    city: z.string().min(1, "City is required")
  });

  const list = querySchema.parse(request.query);

  const { pets } = await listAvailableUseCase.execute(list);

  return reply.status(200).send({ pets });
}
