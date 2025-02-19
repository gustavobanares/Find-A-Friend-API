import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { InMemoryOrganizationRepository } from "@/repositories/in-memory/in-memory-organization-repository";
import { ListAvailablePetsUseCase } from "./list-available-pets";
import { PetType, PetAge, PetSize, PetEnergy, PetIndependence } from "@prisma/client";

let petsRepository: InMemoryPetsRepository;
let organizationRepository: InMemoryOrganizationRepository;
let sut: ListAvailablePetsUseCase;

describe("List Available Pets Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    organizationRepository = new InMemoryOrganizationRepository();
    sut = new ListAvailablePetsUseCase(organizationRepository, petsRepository);
  });

  it("should be able to list pets available for adoption in a city", async () => {
    // Criar organizações em cidades diferentes
    const organization1 = await organizationRepository.create({
      name: "Pet Shelter 1",
      email: "shelter1@example.com",
      passwordHash: "hash123",
      address: "123 Main St",
      city: "São Paulo",
      state: "SP",
      postalCode: "01000-000",
      phone: "11999999999"
    });

    const organization2 = await organizationRepository.create({
      name: "Pet Shelter 2",
      email: "shelter2@example.com",
      passwordHash: "hash456",
      address: "456 Oak St",
      city: "Rio de Janeiro",
      state: "RJ",
      postalCode: "20000-000",
      phone: "21999999999"
    });

    // Criar pets associados à organização de São Paulo
    await petsRepository.create({
      name: "Rex",
      description: "Friendly dog",
      age: PetAge.ADULTO,
      size: PetSize.MEDIO,
      energy: PetEnergy.ALTA,
      independence: PetIndependence.MEDIO,
      type: PetType.CACHORRO,
      photos: ["photo1.jpg"],
      requirements: ["Spacious home"],
      organizationId: organization1.id
    });

    await petsRepository.create({
      name: "Luna",
      description: "Calm cat",
      age: PetAge.FILHOTE,
      size: PetSize.PEQUENO,
      energy: PetEnergy.BAIXA,
      independence: PetIndependence.ALTO,
      type: PetType.GATO,
      photos: ["photo2.jpg"],
      requirements: ["Indoor only"],
      organizationId: organization1.id
    });

    // Criar pet associado à organização do Rio de Janeiro
    await petsRepository.create({
      name: "Bob",
      description: "Playful dog",
      age: PetAge.FILHOTE,
      size: PetSize.GRANDE,
      energy: PetEnergy.ALTA,
      independence: PetIndependence.BAIXO,
      type: PetType.CACHORRO,
      photos: ["photo3.jpg"],
      requirements: ["Large yard"],
      organizationId: organization2.id
    });

    // Buscar pets disponíveis em São Paulo
    const { pets } = await sut.execute({
      city: "São Paulo"
    });

    // Deve encontrar apenas os 2 pets da organização de São Paulo
    expect(pets).toHaveLength(2);
    expect(pets).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Rex" }),
      expect.objectContaining({ name: "Luna" })
    ]));
    expect(pets).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Bob" })
      ])
    );
  });

  it("should return empty array when no organizations exist in the city", async () => {
    // Criar organização em outra cidade
    const organization = await organizationRepository.create({
      name: "Pet Shelter",
      email: "shelter@example.com",
      passwordHash: "hash123",
      address: "123 Main St",
      city: "Belo Horizonte",
      state: "MG",
      postalCode: "30000-000",
      phone: "31999999999"
    });

    // Criar pet
    await petsRepository.create({
      name: "Rex",
      description: "Friendly dog",
      age: PetAge.ADULTO,
      size: PetSize.MEDIO,
      energy: PetEnergy.ALTA,
      independence: PetIndependence.MEDIO,
      type: PetType.CACHORRO,
      photos: ["photo1.jpg"],
      requirements: ["Spacious home"],
      organizationId: organization.id
    });

    // Buscar em cidade sem organizações
    const { pets } = await sut.execute({
      city: "Curitiba"
    });

    // Não deve encontrar nenhum pet
    expect(pets).toHaveLength(0);
  });

  it("should return empty array when organizations exist but have no pets", async () => {
    // Criar organização sem pets
    await organizationRepository.create({
      name: "Empty Shelter",
      email: "empty@example.com",
      passwordHash: "hash789",
      address: "789 Pine St",
      city: "Brasília",
      state: "DF",
      postalCode: "70000-000",
      phone: "61999999999"
    });

    // Buscar pets
    const { pets } = await sut.execute({
      city: "Brasília"
    });

    // Não deve encontrar nenhum pet
    expect(pets).toHaveLength(0);
  });
});