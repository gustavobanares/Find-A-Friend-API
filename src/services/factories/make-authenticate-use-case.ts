import { AuthenticateUseCase } from "../authenticate";
import { PrismaOrganizationRepository } from "@/repositories/prisma/prisma-organization-repository";

export function makeAuthenticateUseCase() {
  const organizationRepository = new PrismaOrganizationRepository();
  const authenticateUseCase = new AuthenticateUseCase(organizationRepository);

  return authenticateUseCase
}
