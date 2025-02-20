import { compare } from "bcryptjs";
import { Organization } from "@prisma/client";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { OrganizationRepository } from "@/repositories/organization-repository";

interface AuthenticateUseCaseRequest {
  email: string;
  passwordHash: string;
}

interface AuthenticateUseCaseResponse {
    organization: Organization
};

export class AuthenticateUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    email,
    passwordHash,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const organization = await this.organizationRepository.findByEmail(email)

    if (!organization){
        throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(passwordHash, organization.passwordHash)

    if(!doesPasswordMatches){
        throw new InvalidCredentialsError()
    }

    return {
        organization,
    }
  }
}
