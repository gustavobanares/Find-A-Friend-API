import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreatePetUseCase } from "@/services/factories/make-create-pet-use-case";

const PetTypeEnum = ["CACHORRO", "GATO", "AVE", "ROEDOR", "OUTRO"] as const;
const PetAgeEnum = ["FILHOTE", "ADULTO", "IDOSO"] as const;
const PetSizeEnum = ["PEQUENO", "MEDIO", "GRANDE"] as const;
const PetEnergyEnum = ["ALTA", "MEDIA", "BAIXA"] as const;
const PetIndependenceEnum = ["ALTO", "MEDIO", "BAIXO"] as const;

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    age: z.enum(PetAgeEnum),
    size: z.enum(PetSizeEnum),
    energy: z.enum(PetEnergyEnum),
    independence: z.enum(PetIndependenceEnum),
    type: z.enum(PetTypeEnum),
    organizationId: z.string(),
    photos: z.array(z.string()),
    requirements: z.array(z.string()),
  });

  const {
    name,
    description,
    age,
    size,
    independence,
    energy,
    type,
    organizationId,
    photos,
    requirements,
  } = createBodySchema.parse(request.body);

  try {
    const createUseCase = makeCreatePetUseCase();

    await createUseCase.execute({
      name,
      description,
      age,
      size,
      energy,
      independence,
      type,
      organizationId,
      photos: photos.map((photo) => ({ url: photo })),
      requirements: requirements.map((requirement) => ({ title: requirement })),
    });
  } catch (error) {
    if (error) {
      return reply
        .status(409)
        .send({
          message: "An unexpected error occurred while creating the pet.",
        });
    }

    throw error;
  }

  return reply.status(201).send();
}
