import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { PrismaOrganizationRepository } from "@/repositories/prisma/prisma-organization-repository";
import { FilterPetsUseCase } from "../filter-pets";

export function makeFilterPetsUseCase() {
  const petsRepository = new PrismaPetsRepository();
  const organizationRepository = new PrismaOrganizationRepository();
  const useCase = new FilterPetsUseCase(petsRepository, organizationRepository);

  return useCase;
}
