import { Prisma, Organization } from "@prisma/client";

export interface OrganizationRepository {
  findAvailableByCity(city: string, page: number): Promise<Organization[]>
  findByEmail(email:string): Promise<Organization | null>
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>;
}
