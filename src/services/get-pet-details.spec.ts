import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import {
  PetAge,
  PetEnergy,
  PetIndependence,
  PetSize,
  PetType,
} from "@prisma/client";
import { GetPetDetailsUseCase } from "./get-pet-details";

let petsRepository: InMemoryPetsRepository;
let sut: GetPetDetailsUseCase;

describe("Get Pet Details Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    sut = new GetPetDetailsUseCase(petsRepository);
  });

  it("should be able to get pet details", async () => {
    const pet = await petsRepository.create({
      name: "Douradinho",
      description: "Cachorro muito dócil e amigável.",
      age: PetAge.ADULTO, // Corrigido para o enum correto
      size: PetSize.GRANDE, // Adicionado um valor válido
      energy: PetEnergy.ALTA, // Adicionado um valor válido
      independence: PetIndependence.MEDIO, // Adicionado um valor válido
      type: PetType.CACHORRO, // Adicionado um valor válido
      organizationId: "org-123",
      photos: ["https://example.com/photo.jpg"], // Exemplo de foto
      requirements: ["Necessário espaço amplo para brincar"], // Exemplo de requisito
    });

    const {pet: foundPet} = await sut.execute({petId: pet.id})

    expect(foundPet.id).toEqual(pet.id);
    expect(foundPet.name).toBe('Douradinho')
  });

  
});
