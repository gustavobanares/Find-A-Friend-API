import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { PrismaOrganizationRepository } from "@/repositories/prisma/prisma-organization-repository";
import { ListAvailablePetsUseCase } from "../list-available-pets";

export function makeListAvailablePetsUseCase() {
  const petRepository = new PrismaPetsRepository();
  const organizationRepository = new PrismaOrganizationRepository();
  const useCase = new ListAvailablePetsUseCase(organizationRepository, petRepository);

  return useCase;
}
