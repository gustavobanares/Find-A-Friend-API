import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { CreatePetUseCase } from "./create-pet";
import { PetAge, PetEnergy, PetIndependence, PetSize, PetType } from "@prisma/client";


let petsRepository: InMemoryPetsRepository;
let sut: CreatePetUseCase;

describe("Create a Pet Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    sut = new CreatePetUseCase(petsRepository);
  });

  it("should be able to create a pet", async () => {
    const { pet } = await sut.execute({
      name: "Douradinho",
      description: "Cachorro muito dócil e amigável.",
      age: PetAge.ADULTO, // Corrigido para o enum correto
      size: PetSize.GRANDE, // Adicionado um valor válido
      energy: PetEnergy.ALTA, // Adicionado um valor válido
      independence: PetIndependence.MEDIO, // Adicionado um valor válido
      type: PetType.CACHORRO, // Adicionado um valor válido
      organizationId: "org-123",
      photos: [{ url: "https://example.com/photo.jpg" }], // Exemplo de foto
      requirements: [{ title: "Necessário espaço amplo para brincar" }], // Exemplo de requisito
    });

    expect(pet.id).toEqual(expect.any(String));
  });

});
