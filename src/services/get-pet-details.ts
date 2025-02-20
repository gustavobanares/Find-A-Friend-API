import { PetsRepository } from "@/repositories/pets-repository";
import { Pet } from "@prisma/client";



interface GetPetDetailsUseCaseRequest {
  petId: string
}

interface GetPetDetailsUseCaseResponse {
    pet: Pet
};

export class GetPetDetailsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    petId,
  }: GetPetDetailsUseCaseRequest): Promise<GetPetDetailsUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet){
        throw new Error('Pet not found')
    }

    return {
        pet,
    }
  }
}
