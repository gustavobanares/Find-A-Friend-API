import { compare } from "bcryptjs";
import { Organization } from "@prisma/client";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { OrganizationRepository } from "@/repositories/organization-repository";

interface AuthenticateUseCaseRequest {
  email: string;
  password_hash: string;
}

interface AuthenticateUseCaseResponse {
    organization: Organization
};

export class AuthenticateUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    email,
    password_hash,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const organization = await this.organizationRepository.findByEmail(email)

    if (!organization){
        throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password_hash, organization.passwordHash)

    if(!doesPasswordMatches){
        throw new InvalidCredentialsError()
    }

    return {
        organization,
    }
  }
}
