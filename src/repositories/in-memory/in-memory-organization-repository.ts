import { Organization, Prisma } from "@prisma/client";
import crypto from "node:crypto";
import { OrganizationRepository } from "../organization-repository";

export class InMemoryOrganizationRepository implements OrganizationRepository {
  public items: Organization[] = [];

  async findByEmail(email: string) {
    const organization = this.items.find((item) => item.email === email);

    if (!organization) {
      return null;
    }

    return organization;
  }

  async createMinimal(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return this.create({
      ...data,
      address: "default address",
      city: "default city",
      state: "default state",
      postalCode: "00000-000",
      phone: "000000000",
    });
  }

  async create(data: Prisma.OrganizationCreateInput) {
    const organization = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    } as Organization;

    this.items.push(organization);

    return organization;
  }
}
