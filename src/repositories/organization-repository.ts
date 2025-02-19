import { Prisma, Organization } from "@prisma/client";

export interface OrganizationRepository {
  findByEmail(email:string): Promise<Organization | null>
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>;
}
