import { Prisma, Organization } from "@prisma/client";

export interface OrganizationRepository {
  findAvailableByCity(city: string): Promise<Organization[]>
  findByEmail(email:string): Promise<Organization | null>
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>;
}
