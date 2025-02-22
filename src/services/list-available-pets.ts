import { OrganizationRepository } from "@/repositories/organization-repository"
import { PetsRepository } from "@/repositories/pets-repository"
import { Pet } from "@prisma/client"

interface ListAvailablePetsRequest {
  city: string
  page: number
}

interface ListAvailablePetsResponse {
  pets: Pet[]
  totalPages: number
}

export class ListAvailablePetsUseCase {
  constructor(
    private organizationRepository: OrganizationRepository,
    private petRepository: PetsRepository
  ) {}

  async execute({
    city,
    page,
  }: ListAvailablePetsRequest): Promise<ListAvailablePetsResponse> {
    const itemsPerPage = 20

    // Busca organizações na cidade
    const organizations = await this.organizationRepository.findAvailableByCity(city, page);
    
    let availablePets: Pet[] = [];
    let totalPets = 0
    
    // Busca pets de cada organização
    for (const organization of organizations) {
      const petsFromOrganization = await this.petRepository.findByOrganizationId(organization.id);
      
      // Adiciona todos os pets à lista (assumindo que todos estão disponíveis)
      availablePets = [...availablePets, ...petsFromOrganization];
      totalPets += petsFromOrganization.length
    }

    const totalPages = Math.ceil(totalPets / itemsPerPage)
    
    return {
      pets: availablePets,
      totalPages,
    };
  }
}