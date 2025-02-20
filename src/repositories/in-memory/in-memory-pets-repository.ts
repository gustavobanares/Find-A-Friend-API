import { PetsRepository } from "@/repositories/pets-repository";
import {
  Pet,
  PetAge,
  PetEnergy,
  PetIndependence,
  PetSize,
  PetType,
  Prisma,
} from "@prisma/client";
import crypto from "node:crypto";

export class InMemoryPetsRepository implements PetsRepository {
 
  public items: Pet[] = [];

  async findById(petId: string) {
    return this.items.find((pet) => pet.id === petId) || null
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Pet;

    this.items.push(pet);

    return pet;
  }

  async findByOrganizationId(organizationId: string): Promise<Pet[]> {
    const pets = this.items.filter(
      (pet) => pet.organizationId === organizationId
    );
    return pets;
  }

  async findManyByFilters(filters: {
    organizationIds: string[];
    type?: PetType;
    age?: PetAge;
    size?: PetSize;
    energy?: PetEnergy;
    independence?: PetIndependence;
  }): Promise<Pet[]> {
    const { organizationIds, ...filterParams } = filters;

    return this.items.filter((pet) => {
      if (!organizationIds.includes(pet.organizationId)) {
        return false;
      }

      // Verificação de tipo segura para cada propriedade
      if (filterParams.type !== undefined && pet.type !== filterParams.type) {
        return false;
      }
      if (filterParams.age !== undefined && pet.age !== filterParams.age) {
        return false;
      }
      if (filterParams.size !== undefined && pet.size !== filterParams.size) {
        return false;
      }
      if (
        filterParams.energy !== undefined &&
        pet.energy !== filterParams.energy
      ) {
        return false;
      }
      if (
        filterParams.independence !== undefined &&
        pet.independence !== filterParams.independence
      ) {
        return false;
      }

      return true;
    });
  }
}
