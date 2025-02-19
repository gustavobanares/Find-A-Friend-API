import { OrganizationRepository } from "@/repositories/organization-repository"
import { PetsRepository } from "@/repositories/pets-repository"
import { Pet } from "@prisma/client"

interface ListAvailablePetsRequest {
  city: string
}

interface ListAvailablePetsResponse {
  pets: Pet[]
}

export class ListAvailablePetsUseCase {
  constructor(
    private organizationRepository: OrganizationRepository,
    private petRepository: PetsRepository
  ) {}

  async execute({
    city,
  }: ListAvailablePetsRequest): Promise<ListAvailablePetsResponse> {
    // Busca organizações na cidade
    const organizations = await this.organizationRepository.findAvailableByCity(city);
    
    let availablePets: Pet[] = [];
    
    // Busca pets de cada organização
    for (const organization of organizations) {
      const petsFromOrganization = await this.petRepository.findByOrganizationId(organization.id);
      
      // Adiciona todos os pets à lista (assumindo que todos estão disponíveis)
      availablePets = [...availablePets, ...petsFromOrganization];
    }
    
    return {
      pets: availablePets,
    };
  }
}