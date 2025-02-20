import { Prisma, Pet } from "@prisma/client";

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
  findByOrganizationId(organizationId: string): Promise<Pet[]>;
  findById(petId: string): Promise<Pet | null>
}
