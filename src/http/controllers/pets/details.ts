import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetPetDetailsUseCase } from "@/services/factories/make-get-pet-details-use-case";
import { z } from "zod";

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const getPetDetailsUseCase = makeGetPetDetailsUseCase();

  const paramsSchema = z.object({
    petId: z.string().uuid(),
  })

  const {petId} = paramsSchema.parse(request.params)

  const { pet } = await getPetDetailsUseCase.execute({
    petId,
  });

  return reply.status(200).send({
    pet,
  });
}
