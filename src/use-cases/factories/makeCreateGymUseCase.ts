import { PrismaGymsRepository } from '@/repositories/prisma/prismaGymsRepository';
import { CreateGymUseCase } from '../createGym';

export function makeCreateGymUseCase() {
    const gymsRepository = new PrismaGymsRepository();
    const useCase = new CreateGymUseCase(gymsRepository);

    return useCase;
}
