import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFilterPetsUseCase } from "@/services/factories/make-filter-pets-use-case";
import { PetAge, PetEnergy, PetIndependence, PetSize, PetType } from "@prisma/client";

export async function filter(request: FastifyRequest, reply: FastifyReply) {
  const filterPetsUseCase = makeFilterPetsUseCase();

  const querySchema = z.object({
    city: z.string().min(1, "City is required"), // Cidade obrigatória
    type: z.nativeEnum(PetType).optional(),
    age: z.nativeEnum(PetAge).optional(),
    size: z.nativeEnum(PetSize).optional(),
    energy: z.nativeEnum(PetEnergy).optional(),
    independence: z.nativeEnum(PetIndependence).optional(),
  });

  const filters = querySchema.parse(request.query);

  const { pets } = await filterPetsUseCase.execute(filters);

  return reply.status(200).send({ pets });
}
