import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrganizationRepository } from '@/repositories/in-memory/in-memory-organization-repository'
import { PetAge, PetEnergy, PetIndependence, PetSize, PetType } from '@prisma/client'
import { FilterPetsUseCase } from './filter-pets'

describe('Filter Pets Use Case', () => {
  let petsRepository: InMemoryPetsRepository
  let organizationRepository: InMemoryOrganizationRepository
  let sut: FilterPetsUseCase

  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new FilterPetsUseCase(petsRepository, organizationRepository)

    // Configurando organizações teste
    organizationRepository.items = [
      {
        id: 'org-01',
        name: 'Org SP',
        email: 'orgsp@example.com',
        passwordHash: '123456',
        phone: '11999999999',
        address: 'Rua A, 123',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01000000',
        createdAt: new Date(),
        updateAt: new Date(),
      },
      {
        id: 'org-02',
        name: 'Org RJ',
        email: 'orgrj@example.com',
        passwordHash: '123456',
        phone: '21999999999',
        address: 'Rua B, 456',
        city: 'Rio de Janeiro',
        state: 'RJ',
        postalCode: '20000000',
        createdAt: new Date(),
        updateAt: new Date(),
      }
    ]

    // Configurando pets teste
    petsRepository.items = [
      {
        id: 'pet-01',
        name: 'Rex',
        description: 'Cachorro dócil',
        age: PetAge.ADULTO,
        size: PetSize.MEDIO,
        energy: PetEnergy.ALTA,
        independence: PetIndependence.MEDIO,
        type: PetType.CACHORRO,
        photos: ['photo1.jpg'],
        requirements: ['Espaço amplo'],
        organizationId: 'org-01',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'pet-02',
        name: 'Miau',
        description: 'Gato tranquilo',
        age: PetAge.IDOSO,
        size: PetSize.PEQUENO,
        energy: PetEnergy.BAIXA,
        independence: PetIndependence.ALTO,
        type: PetType.GATO,
        photos: ['photo2.jpg'],
        requirements: ['Ambiente calmo'],
        organizationId: 'org-01',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'pet-03',
        name: 'Pingo',
        description: 'Cachorro filhote',
        age: PetAge.FILHOTE,
        size: PetSize.PEQUENO,
        energy: PetEnergy.ALTA,
        independence: PetIndependence.BAIXO,
        type: PetType.CACHORRO,
        photos: ['photo3.jpg'],
        requirements: ['Tempo para treinar'],
        organizationId: 'org-02',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  })

  it('deve retornar erro quando cidade não for fornecida', async () => {
    await expect(() => 
      sut.execute({ city: '' })
    ).rejects.toThrow('City is required')
  })

  it('deve retornar lista vazia quando não houver organizações na cidade', async () => {
    const { pets } = await sut.execute({ city: 'Curitiba' })
    
    expect(pets).toHaveLength(0)
  })

  it('deve retornar todos os pets da cidade quando não houver filtros adicionais', async () => {
    const { pets } = await sut.execute({ city: 'São Paulo' })
    
    expect(pets).toHaveLength(2)
    expect(pets).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'pet-01' }),
      expect.objectContaining({ id: 'pet-02' })
    ]))
  })

  it('deve filtrar pets por tipo', async () => {
    const { pets } = await sut.execute({ 
      city: 'São Paulo',
      type: PetType.GATO
    })
    
    expect(pets).toHaveLength(1)
    expect(pets[0].id).toBe('pet-02')
  })

  it('deve filtrar pets por idade', async () => {
    const { pets } = await sut.execute({ 
      city: 'São Paulo',
      age: PetAge.ADULTO
    })
    
    expect(pets).toHaveLength(1)
    expect(pets[0].id).toBe('pet-01')
  })

  it('deve filtrar pets por tamanho', async () => {
    const { pets } = await sut.execute({ 
      city: 'São Paulo',
      size: PetSize.PEQUENO
    })
    
    expect(pets).toHaveLength(1)
    expect(pets[0].id).toBe('pet-02')
  })

  it('deve filtrar pets por nível de energia', async () => {
    const { pets } = await sut.execute({ 
      city: 'São Paulo',
      energy: PetEnergy.ALTA
    })
    
    expect(pets).toHaveLength(1)
    expect(pets[0].id).toBe('pet-01')
  })

  it('deve filtrar pets por independência', async () => {
    const { pets } = await sut.execute({ 
      city: 'São Paulo',
      independence: PetIndependence.ALTO
    })
    
    expect(pets).toHaveLength(1)
    expect(pets[0].id).toBe('pet-02')
  })

  it('deve combinar múltiplos filtros corretamente', async () => {
    const { pets } = await sut.execute({ 
      city: 'São Paulo',
      type: PetType.CACHORRO,
      energy: PetEnergy.ALTA,
      size: PetSize.MEDIO
    })
    
    expect(pets).toHaveLength(1)
    expect(pets[0].id).toBe('pet-01')
  })

  it('deve retornar lista vazia quando nenhum pet atende aos critérios', async () => {
    const { pets } = await sut.execute({ 
      city: 'São Paulo',
      type: PetType.CACHORRO,
      age: PetAge.IDOSO
    })
    
    expect(pets).toHaveLength(0)
  })
})