import { PetsRepository } from "@/repositories/pets-repository";
import { OrganizationRepository } from "@/repositories/organization-repository";
import {
  PetAge,
  PetSize,
  PetEnergy,
  PetIndependence,
  PetType,
  Pet,
} from "@prisma/client";

interface FilterPetsUseCaseRequest {
  city: string;
  type?: PetType;
  age?: PetAge;
  size?: PetSize;
  energy?: PetEnergy;
  independence?: PetIndependence;
}

interface FilterPetsUseCaseResponse {
  pets: Pet[];
}

export class FilterPetsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private organizationRepository: OrganizationRepository
  ) {}

  async execute(
    filters: FilterPetsUseCaseRequest
  ): Promise<FilterPetsUseCaseResponse> {
    if (!filters.city || filters.city.trim() === "") {
      throw new Error("City is required");
    }

    const organizations = await this.organizationRepository.findAvailableByCity(
      filters.city
    );
    const organizationIds = organizations.map(org => org.id)

    if(organizationIds.length === 0){
        return {pets: []}
    }

    let availablePets: Pet[] = [];

    for (const organization of organizations) {
      const petsFormOrganization =
        await this.petsRepository.findByOrganizationId(organization.id);
      availablePets = [...availablePets, ...petsFormOrganization];
    }

    const filteredPets = availablePets.filter((pet) => {
      if (filters.type && pet.type !== filters.type) {
        return false;
      }

      if (filters.age && pet.age !== filters.age) {
        return false;
      }

      if (filters.size && pet.size !== filters.size) {
        return false;
      }

      if (filters.energy && pet.energy !== filters.energy) {
        return false;
      }

      if (filters.independence && pet.independence !== filters.independence) {
        return false;
      }

      return true;
    });

    return {
      pets: filteredPets,
    };
  }
}
