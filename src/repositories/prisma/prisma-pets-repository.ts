import { prisma } from "@/lib/prisma";
import { Pet, Prisma } from "@prisma/client";
import { PetsRepository } from "../pets-repository";

export class PrismaPetsRepository implements PetsRepository {
  async findByOrganizationId(
    organizationId: string,
    page: number,
    itemsPerPage: number
  ) {
    const skip = (page - 1) * itemsPerPage;
    const take = itemsPerPage;

    const pets = await prisma.pet.findMany({
      where: {
        organizationId: organizationId,
      },
      skip: skip,
      take: take,
    });

    return pets;
  }
  async findById(petId: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    });

    return pet;
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    });

    return pet;
  }
}
