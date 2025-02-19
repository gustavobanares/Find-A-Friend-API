import { PetsRepository } from "@/repositories/pets-repository";
import { Pet, Prisma } from "@prisma/client";
import crypto from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
    
    public items: Pet[] = [];

    async create(data: Prisma.PetUncheckedCreateInput){
        const pet = {
           id: crypto.randomUUID(),
           createdAt: new Date(),
           updatedAt: new Date(),
           ...data,
        } as Pet

        this.items.push(pet)

        return pet
    }

    async findByOrganizationId(organizationId: string): Promise<Pet[]> {
        const pets = this.items.filter(pet => pet.organizationId === organizationId);
        return pets;
    }
}