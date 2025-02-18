import { PetsRepository } from "@/repositories/pets-repository"
import { PetAge, PetSize, PetEnergy, PetIndependence, PetType, Pet } from "@prisma/client"

interface CreatePetUseCaseRequest {
    name: string
    description: string
    age: PetAge
    size: PetSize
    energy: PetEnergy
    independence: PetIndependence
    type: PetType
    organizationId: string
    photos: { url: string }[]
    requirements: { title: string }[]
}

interface CreatePetUseCaseResponse {
    pet: Pet
}

export class CreatePetUseCase {
    constructor(private petsRepository: PetsRepository) {}

    async execute({
        name,
        description,
        age,
        size,
        energy,
        independence,
        type,
        organizationId,
        photos,
        requirements,
    }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
        const pet = await this.petsRepository.create({
            name,
            description,
            age,
            size,
            energy,
            independence,
            type,
            organizationId, 
            photos: photos.map(photo => photo.url),
            requirements: requirements.map(req => req.title),
        });

        return { pet };
    }
}
