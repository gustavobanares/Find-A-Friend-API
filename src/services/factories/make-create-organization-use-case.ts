import { CreateOrganizationUseCase } from "../create-organization";
import { PrismaOrganizationRepository } from "@/repositories/prisma/prisma-organization-repository";

export function makeCreateOrganizationUseCase() {
  const organizationRepository = new PrismaOrganizationRepository();
  const useCase = new CreateOrganizationUseCase(organizationRepository);

  return useCase
}
