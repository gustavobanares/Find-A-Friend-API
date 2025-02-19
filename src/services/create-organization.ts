import { OrganizationRepository } from "@/repositories/organization-repository";
import { Organization } from "@prisma/client";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/organization-already-exists";

interface CreateOrganizationUseCaseRequest {
  name: string;
  email: string;
  passwordHash: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

interface CreateOrganizationUseCaseResponse {
  organization: Organization;
}

export class CreateOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute({
    name,
    email,
    passwordHash,
    address,
    city,
    state,
    postalCode,
    phone,
  }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
    const password_hash = await hash(passwordHash, 6);

    const organizationWithSameEmail =
      await this.organizationRepository.findByEmail(email);

    if (organizationWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const organization = await this.organizationRepository.create({
      name,
      email,
      passwordHash: password_hash,
      address,
      city,
      state,
      postalCode,
      phone,
    });

    return { organization };
  }
}
